document.addEventListener("DOMContentLoaded", async function() {
    await loadComments();
});

async function loadComments() {
    const commentsContainer = document.getElementById("comments-container");
    commentsContainer.innerHTML = ""; // Clear existing comments

    try {
        const snapshot = await db.collection("comments").orderBy("timestamp", "asc").get();
        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        comments.forEach(comment => {
            if (!comment.parentId) {
                displayComment(comment, commentsContainer);
            }
        });
    } catch (e) {
        console.error("Ошибка загрузки комментариев: ", e);
    }
}

function displayComment(comment, container) {
    const commentElement = document.createElement("div");
    commentElement.className = "comment";
    commentElement.innerHTML = `
        <p><strong>${comment.name}</strong> <em>${new Date(comment.timestamp.seconds * 1000).toLocaleString()}</em></p>
        <p>${comment.text}</p>
        <button onclick="showReplyForm('${comment.id}')">Ответить</button>
        <div class="replies"></div>
    `;
    container.appendChild(commentElement);

    const repliesContainer = commentElement.querySelector(".replies");

    const replies = db.collection("comments").where("parentId", "==", comment.id).orderBy("timestamp", "asc").get();
    replies.then(snapshot => {
        snapshot.docs.forEach(doc => {
            displayComment({ id: doc.id, ...doc.data() }, replies
