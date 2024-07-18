document.addEventListener("DOMContentLoaded", function () {
    const db = firebase.firestore();

    async function loadComments() {
        try {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = '';

            const snapshot = await db.collection('comments').orderBy('timestamp').get();

            snapshot.forEach(doc => {
                const comment = doc.data();
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p><strong>${comment.name || 'Аноним'}</strong> ${new Date(comment.timestamp.toDate()).toLocaleString()}</p>
                    <p>${comment.text}</p>
                    <button onclick="showReplyForm('${doc.id}')">Ответить</button>
                `;
                commentsContainer.appendChild(commentElement);
            });
        } catch (e) {
            console.error("Ошибка загрузки комментариев: ", e);
        }
    }

    loadComments();
});
