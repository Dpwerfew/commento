document.addEventListener("DOMContentLoaded", function () {
    const db = firebase.firestore();

    function showReplyForm(parentId) {
        document.getElementById('replyTo').value = parentId;
        const modal = document.getElementById('replyModal');
        modal.style.display = 'flex';
    }

    function closeReplyModal() {
        const modal = document.getElementById('replyModal');
        modal.style.display = 'none';
    }

    async function addComment(parentId = null) {
        const commentInput = parentId ? document.getElementById('replyComment').value : document.getElementById('comment').value;
        const nameInput = parentId ? document.getElementById('replyName').value : document.getElementById('name').value || "Аноним";

        if (commentInput.trim() === "") {
            alert("Комментарий не может быть пустым");
            return;
        }

        try {
            const newCommentRef = await db.collection("comments").add({
                text: commentInput,
                name: nameInput,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                parentId: parentId
            });

            const newComment = {
                text: commentInput,
                name: nameInput,
                timestamp: new Date(),
                id: newCommentRef.id,
                parentId: parentId
            };

            appendComment(newComment);

            if (parentId) {
                document.getElementById('replyComment').value = '';
                document.getElementById('replyName').value = '';
                closeReplyModal();
            } else {
                document.getElementById('comment').value = '';
                document.getElementById('name').value = '';
            }

        } catch (e) {
            console.error("Ошибка добавления комментария: ", e);
        }
    }

    function appendComment(comment) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.setAttribute('data-id', comment.id);
        commentElement.innerHTML = `
            <p><strong>${comment.name || 'Аноним'}</strong> ${comment.timestamp.toLocaleString()}</p>
            <p>${comment.text}</p>
            <button class="reply-button" onclick="showReplyForm('${comment.id}')">Ответить</button>
            <div class="replies"></div>
        `;

        if (comment.parentId) {
            const parentCommentElement = document.querySelector(`div[data-id='${comment.parentId}'] .replies`);
            if (parentCommentElement) {
                parentCommentElement.appendChild(commentElement);
            }
        } else {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.appendChild(commentElement);
        }
    }

    window.addComment = addComment;
    window.showReplyForm = showReplyForm;
    window.closeReplyModal = closeReplyModal;
});
