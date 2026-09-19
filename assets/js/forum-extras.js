/* =========================================================
   LUMALIA — forum-extras.js
   Notifications, suivi, signalements, upload (ImgBB)
   ========================================================= */

(function () {

  // ============================================================
  // ⚠️ CONFIGURATION IMGBB — REMPLACE PAR TA CLÉ API
  // ============================================================
  const IMGBB_API_KEY = "TA_CLE_API_IMGBB";

  function getDb() {
    return firebase.firestore();
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  async function createNotification(data) {
    try {
      await getDb().collection("notifications").add({
        userId: data.userId,
        type: data.type || "forum_reply",
        title: data.title || "Notification",
        message: data.message || "",
        link: data.link || "/",
        read: false,
        meta: data.meta || {},
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      console.error("[Extras] Erreur création notification :", err);
    }
  }

  async function countUnread(userId) {
    if (!userId) return 0;
    try {
      const snap = await getDb().collection("notifications")
        .where("userId", "==", userId)
        .where("read", "==", false)
        .get();
      return snap.size;
    } catch (err) {
      console.warn("[Extras] Erreur count unread :", err);
      return 0;
    }
  }

  async function markAsRead(notifId) {
    try {
      await getDb().collection("notifications").doc(notifId).update({ read: true });
    } catch (err) {
      console.error("[Extras] Erreur mark as read :", err);
    }
  }

  async function markAllAsRead(userId) {
    if (!userId) return;
    try {
      const snap = await getDb().collection("notifications")
        .where("userId", "==", userId)
        .where("read", "==", false)
        .get();

      const batch = getDb().batch();
      snap.forEach(function (doc) {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error("[Extras] Erreur mark all as read :", err);
    }
  }

  async function deleteNotification(notifId) {
    try {
      await getDb().collection("notifications").doc(notifId).delete();
    } catch (err) {
      console.error("[Extras] Erreur delete notif :", err);
    }
  }

  // ============================================================
  // SUIVI DE SUJET
  // ============================================================

  async function isFollowing(userId, topicId) {
    if (!userId || !topicId) return false;
    try {
      const snap = await getDb().collection("forum_follows")
        .where("userId", "==", userId)
        .where("topicId", "==", topicId)
        .limit(1)
        .get();
      return !snap.empty;
    } catch (err) {
      console.warn("[Extras] Erreur isFollowing :", err);
      return false;
    }
  }

  async function follow(userId, topicId, categoryId) {
    try {
      await getDb().collection("forum_follows").add({
        userId: userId,
        topicId: topicId,
        categoryId: categoryId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      console.error("[Extras] Erreur follow :", err);
      throw err;
    }
  }

  async function unfollow(userId, topicId) {
    try {
      const snap = await getDb().collection("forum_follows")
        .where("userId", "==", userId)
        .where("topicId", "==", topicId)
        .get();

      const batch = getDb().batch();
      snap.forEach(function (doc) { batch.delete(doc.ref); });
      await batch.commit();
    } catch (err) {
      console.error("[Extras] Erreur unfollow :", err);
      throw err;
    }
  }

  async function notifyFollowers(topicId, categoryId, topicTitle, authorName, excludeUserId) {
    try {
      const snap = await getDb().collection("forum_follows")
        .where("topicId", "==", topicId)
        .get();

      for (const doc of snap.docs) {
        const data = doc.data();
        if (data.userId === excludeUserId) continue;

        await createNotification({
          userId: data.userId,
          type: "forum_reply",
          title: "Nouvelle réponse",
          message: authorName + " a répondu à \"" + topicTitle + "\"",
          link: "/forum?c=" + categoryId + "&t=" + topicId,
          meta: { topicId: topicId, categoryId: categoryId }
        });
      }
    } catch (err) {
      console.error("[Extras] Erreur notifyFollowers :", err);
    }
  }

  // ============================================================
  // RECHERCHE
  // ============================================================

  async function searchTopics(query) {
    if (!query || query.length < 2) return [];

    try {
      const snap = await getDb().collection("forum_topics").limit(500).get();

      const q = query.toLowerCase().trim();
      const results = [];

      snap.forEach(function (doc) {
        const data = doc.data();
        if ((data.title || "").toLowerCase().includes(q)) {
          results.push({ id: doc.id, ...data });
        }
      });

      return results.sort(function (a, b) {
        const aDate = a.lastReplyAt ? a.lastReplyAt.toMillis() : (a.createdAt ? a.createdAt.toMillis() : 0);
        const bDate = b.lastReplyAt ? b.lastReplyAt.toMillis() : (b.createdAt ? b.createdAt.toMillis() : 0);
        return bDate - aDate;
      });
    } catch (err) {
      console.error("[Extras] Erreur recherche :", err);
      return [];
    }
  }

  // ============================================================
  // SIGNALEMENTS
  // ============================================================

  async function reportPost(data) {
    try {
      await getDb().collection("forum_reports").add({
        postId: data.postId,
        topicId: data.topicId,
        categoryId: data.categoryId,
        reporterId: data.reporterId,
        reporterName: data.reporterName || "Anonyme",
        reason: data.reason,
        message: data.message || "",
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        resolvedAt: null,
        resolvedBy: null
      });
      return true;
    } catch (err) {
      console.error("[Extras] Erreur report :", err);
      throw err;
    }
  }

  // ============================================================
  // UPLOAD D'IMAGES via ImgBB
  // ============================================================

  async function uploadImage(file, userId) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Seules les images sont autorisées.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image trop lourde (max 5 MB).");
    }

    // Encode l'image en base64
    const base64 = await new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result.split(",")[1]); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Prépare l'envoi
    const formData = new FormData();
    formData.append("key", 24caa6941630a33005bf7375722ad310);
    formData.append("image", base64);
    formData.append("name", "lumalia_" + Date.now());

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'upload (HTTP " + response.status + ")");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error((data.error && data.error.message) || "Erreur ImgBB");
    }

    return data.data.display_url || data.data.url;
  }

  // ============================================================
  // API GLOBALE
  // ============================================================
  window.LumaForum = {
    // Notifications
    createNotification: createNotification,
    countUnread: countUnread,
    markAsRead: markAsRead,
    markAllAsRead: markAllAsRead,
    deleteNotification: deleteNotification,

    // Suivi
    isFollowing: isFollowing,
    follow: follow,
    unfollow: unfollow,
    notifyFollowers: notifyFollowers,

    // Recherche
    searchTopics: searchTopics,

    // Signalements
    reportPost: reportPost,

    // Upload
    uploadImage: uploadImage
  };
})();
