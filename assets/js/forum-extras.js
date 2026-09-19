/* =========================================================
   LUMALIA — forum-extras.js
   Notifications, suivi, signalements, upload (ImgBB)
   ========================================================= */

(function () {

  var IMGBB_API_KEY = "TA_CLE_API_IMGBB";

  function getDb() {
    return firebase.firestore();
  }

  /* ============================================================
     NOTIFICATIONS
     ============================================================ */

  function createNotification(data) {
    return getDb().collection("notifications").add({
      userId: data.userId,
      type: data.type || "forum_reply",
      title: data.title || "Notification",
      message: data.message || "",
      link: data.link || "/",
      read: false,
      meta: data.meta || {},
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (err) {
      console.error("[Extras] createNotification:", err);
    });
  }

  function countUnread(userId) {
    if (!userId) return Promise.resolve(0);
    return getDb().collection("notifications")
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get()
      .then(function (snap) { return snap.size; })
      .catch(function (err) {
        console.warn("[Extras] countUnread:", err);
        return 0;
      });
  }

  function markAsRead(notifId) {
    return getDb().collection("notifications").doc(notifId)
      .update({ read: true })
      .catch(function (err) { console.error("[Extras] markAsRead:", err); });
  }

  function markAllAsRead(userId) {
    if (!userId) return Promise.resolve();
    return getDb().collection("notifications")
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get()
      .then(function (snap) {
        var batch = getDb().batch();
        snap.forEach(function (doc) {
          batch.update(doc.ref, { read: true });
        });
        return batch.commit();
      })
      .catch(function (err) { console.error("[Extras] markAllAsRead:", err); });
  }

  function deleteNotification(notifId) {
    return getDb().collection("notifications").doc(notifId)
      .delete()
      .catch(function (err) { console.error("[Extras] deleteNotification:", err); });
  }

  /* ============================================================
     SUIVI DE SUJET
     ============================================================ */

  function isFollowing(userId, topicId) {
    if (!userId || !topicId) return Promise.resolve(false);
    return getDb().collection("forum_follows")
      .where("userId", "==", userId)
      .where("topicId", "==", topicId)
      .limit(1)
      .get()
      .then(function (snap) { return !snap.empty; })
      .catch(function (err) {
        console.warn("[Extras] isFollowing:", err);
        return false;
      });
  }

  function follow(userId, topicId, categoryId) {
    return getDb().collection("forum_follows").add({
      userId: userId,
      topicId: topicId,
      categoryId: categoryId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  function unfollow(userId, topicId) {
    return getDb().collection("forum_follows")
      .where("userId", "==", userId)
      .where("topicId", "==", topicId)
      .get()
      .then(function (snap) {
        var batch = getDb().batch();
        snap.forEach(function (doc) { batch.delete(doc.ref); });
        return batch.commit();
      });
  }

  function notifyFollowers(topicId, categoryId, topicTitle, authorName, excludeUserId) {
    return getDb().collection("forum_follows")
      .where("topicId", "==", topicId)
      .get()
      .then(function (snap) {
        var promises = [];
        snap.forEach(function (doc) {
          var data = doc.data();
          if (data.userId === excludeUserId) return;

          promises.push(createNotification({
            userId: data.userId,
            type: "forum_reply",
            title: "Nouvelle réponse",
            message: authorName + " a répondu à \"" + topicTitle + "\"",
            link: "/forum?c=" + categoryId + "&t=" + topicId,
            meta: { topicId: topicId, categoryId: categoryId }
          }));
        });
        return Promise.all(promises);
      })
      .catch(function (err) {
        console.error("[Extras] notifyFollowers:", err);
      });
  }

  /* ============================================================
     RECHERCHE
     ============================================================ */

  function searchTopics(query) {
    if (!query || query.length < 2) return Promise.resolve([]);

    return getDb().collection("forum_topics").limit(500).get()
      .then(function (snap) {
        var q = query.toLowerCase().trim();
        var results = [];

        snap.forEach(function (doc) {
          var data = doc.data();
          if ((data.title || "").toLowerCase().indexOf(q) !== -1) {
            var item = { id: doc.id };
            for (var k in data) {
              if (data.hasOwnProperty(k)) item[k] = data[k];
            }
            results.push(item);
          }
        });

        return results.sort(function (a, b) {
          var aDate = a.lastReplyAt ? a.lastReplyAt.toMillis() : (a.createdAt ? a.createdAt.toMillis() : 0);
          var bDate = b.lastReplyAt ? b.lastReplyAt.toMillis() : (b.createdAt ? b.createdAt.toMillis() : 0);
          return bDate - aDate;
        });
      })
      .catch(function (err) {
        console.error("[Extras] searchTopics:", err);
        return [];
      });
  }

  /* ============================================================
     SIGNALEMENTS
     ============================================================ */

  function reportPost(data) {
    return getDb().collection("forum_reports").add({
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
  }

  /* ============================================================
     UPLOAD D'IMAGES via ImgBB
     ============================================================ */

  function uploadImage(file, userId) {
    if (!file.type.startsWith("image/")) {
      return Promise.reject(new Error("Seules les images sont autorisees."));
    }
    if (file.size > 5 * 1024 * 1024) {
      return Promise.reject(new Error("Image trop lourde (max 5 MB)."));
    }

    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var base64 = reader.result.split(",")[1];

        var formData = new FormData();
        formData.append("key", IMGBB_API_KEY);
        formData.append("image", base64);
        formData.append("name", "lumalia_" + Date.now());

        fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error("Erreur HTTP " + response.status);
            }
            return response.json();
          })
          .then(function (data) {
            if (!data.success) {
              var msg = (data.error && data.error.message) ? data.error.message : "Erreur ImgBB";
              throw new Error(msg);
            }
            resolve(data.data.display_url || data.data.url);
          })
          .catch(reject);
      };
      reader.onerror = function () { reject(new Error("Lecture du fichier echouee")); };
      reader.readAsDataURL(file);
    });
  }

  /* ============================================================
     API GLOBALE
     ============================================================ */
  window.LumaForum = {
    createNotification: createNotification,
    countUnread: countUnread,
    markAsRead: markAsRead,
    markAllAsRead: markAllAsRead,
    deleteNotification: deleteNotification,

    isFollowing: isFollowing,
    follow: follow,
    unfollow: unfollow,
    notifyFollowers: notifyFollowers,

    searchTopics: searchTopics,

    reportPost: reportPost,

    uploadImage: uploadImage
  };
})();
