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

        const recaptchaResponse = await grecaptcha.enterprise.execute('6LdyaxMqAAAAAAxJljB3lWtfuF4hX7qhoexSMmc', {action: 'submit'});
        if (!recaptchaResponse) {
            alert("Пожалуйста, подтвердите, что вы не робот.");
            return;
        }

        try {
            const newCommentRef = await db.collection("comments").add({
                text: commentInput,
                name: nameInput,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                parentId: parentId,
                recaptcha: recaptchaResponse
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

            // Сброс reCAPTCHA после успешной отправки
            grecaptcha.enterprise.reset();

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

        const replyButton = commentElement.querySelector('.reply-button');
        replyButton.style.backgroundColor = '#007BFF';
        replyButton.style.color = 'white';
        replyButton.style.border = 'none';
        replyButton.style.padding = '5px 10px';
        replyButton.style.cursor = 'pointer';
        replyButton.style.borderRadius = '4px';
        replyButton.style.transition = 'background-color 0.3s';
        replyButton.style.marginTop = '10px';

        replyButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#0056b3';
        });
        replyButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#007BFF';
        });

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

    async function onSubmitReplyForm() {
        grecaptcha.enterprise.ready(async () => {
            const token = await grecaptcha.enterprise.execute('6LdyaxMqAAAAAAxJljB3lWtfuF4hX7qhoexSMmc', {action: 'submit'});
            addComment(document.getElementById('replyTo').value, token);
        });
    }

    window.addComment = addComment;
    window.showReplyForm = showReplyForm;
    window.closeReplyModal = closeReplyModal;
    window.onSubmitReplyForm = onSubmitReplyForm;
});
