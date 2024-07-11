// loadComments.js
async function loadComments() {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = '';
    const querySnapshot = await db.collection("comments").orderBy("timestamp", "asc").get();

    const comments = {};
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const comment = document.createElement('div');
        comment.classList.add('comment');
        comment.setAttribute('data-id', doc.id);
        comment.innerHTML = `<strong>${data.name}</strong> <em>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</em><p>${data.text}</p>`;
        const replyButton = document.createElement('button');
        replyButton.innerText = "Ответить";
        replyButton.classList.add('reply-button');
        replyButton.onclick = () => showReplyForm(doc.id);
        comment.appendChild(replyButton);

        comments[doc.id] = { element: comment, parentId: data.parentId };
    });

    // Build the comments tree
    Object.keys(comments).forEach(id => {
        const comment = comments[id];
        if (comment.parentId) {
            if (comments[comment.parentId]) {
                const parentComment = comments[comment.parentId].element;
                const repliesDiv = parentComment.querySelector('.replies') || document.createElement('div');
                repliesDiv.classList.add('replies');
                repliesDiv.appendChild(comment.element);
                parentComment.appendChild(repliesDiv);
            }
        } else {
            commentsDiv.appendChild(comment.element);
        }
    });
}

window.onload = loadComments;
