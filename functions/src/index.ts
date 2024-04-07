import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {FieldValue, getFirestore} from "firebase-admin/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

export const updatePostsStats = onDocumentCreated(
  "/posts/{postId}",
  async (event) => {
    const userId = event.data?.data().uid;

    if (!userId) {
      logger.error("No user ID found in post", event.params.postId);
      return null;
    }

    const db = getFirestore();

    const userDocRef = db.collection("users").doc(userId);
    logger.log("Updating posts count of user", userId);

    return userDocRef.update({postsCount: FieldValue.increment(1)});
  });
