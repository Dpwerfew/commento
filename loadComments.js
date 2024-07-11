// loadComments.js
async function loadComments() {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = '';
    const querySnapshot = await db.collection("comments").orderBy("timestamp", "desc").get();
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const comment = document.createElement('div');
        comment.classList.add('comment');
        if (data.parentId) {
            comment.classList.add('reply');
        }
        comment.innerHTML = `<strong>${data.name}</strong> <em>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</em><p>${data.text}</p>`;
        const replyButton = document.createElement('button');
        replyButton.innerText = "Ответить";
        replyButton.classList.add('reply-button');
        replyButton.onclick = () => showReplyForm(doc.id);
        comment.appendChild(replyButton);
        commentsDiv.appendChild(comment);
    });
}

window.onload = loadComments;
