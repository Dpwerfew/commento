document.addEventListener("DOMContentLoaded", function () {
    const db = firebase.firestore();

    async function loadComments() {
        try {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = '';

            const snapshot = await db.collection('comments').orderBy('timestamp').get();

            const commentsMap = {};

            snapshot.forEach(doc => {
                const comment = doc.data();
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.setAttribute('data-id', doc.id);
                commentElement.innerHTML = `
                    <p><strong>${comment.name || 'Аноним'}</strong> ${new Date(comment.timestamp.toDate()).toLocaleString()}</p>
                    <p>${comment.text}</p>
                    <button onclick="showReplyForm('${doc.id}')">Ответить</button>
                    <div class="replies"></div>
                `;
                commentsMap[doc.id] = {
                    element: commentElement,
                    parentId: comment.parentId
                };
            });

            // Построение дерева комментариев
            Object.values(commentsMap).forEach(comment => {
                if (comment.parentId) {
                    const parentComment = commentsMap[comment.parentId];
                    parentComment.element.querySelector('.replies').appendChild(comment.element);
                } else {
                    commentsContainer.appendChild(comment.element);
                }
            });

        } catch (e) {
            console.error("Ошибка загрузки комментариев: ", e);
        }
    }

    loadComments();
});
