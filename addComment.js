// addComment.js
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("replyModal");
    const span = document.getElementsByClassName("close")[0];

    // Закрыть модальную форму при клике на <span> (x)
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Закрыть модальную форму при клике вне ее
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    async function addComment(parentId = null) {
        const commentInput = document.getElementById('comment').value;
        const nameInput = document.getElementById('name').value || "Аноним";
        if (commentInput.trim() === "") {
            alert("Комментарий не может быть пустым");
            return;
        }
        try {
            await db.collection("comments").add({
                text: commentInput,
                name: nameInput,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                parentId: parentId
            });
            document.getElementById('comment').value = '';
            document.getElementById('name').value = '';
            document.getElementById('replyTo').value = '';
            modal.style.display = "none";
            // Загрузить комментарии после добавления нового
            loadComments();
        } catch (e) {
            console.error("Ошибка добавления комментария: ", e);
        }
    }

    window.showReplyForm = function(parentId) {
        document.getElementById('replyTo').value = parentId;
        modal.style.display = "block";
    }

    window.addComment = addComment;
});
