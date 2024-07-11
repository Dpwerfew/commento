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
        const commentInput = parentId ? document.getElementById('replyComment').value : document.getElementById('comment').value;
        const nameInput = parentId ? document.getElementById('replyName').value : document.getElementById('name').value || "Аноним";
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
            if (parentId) {
                document.getElementById('replyComment').value = '';
                document.getElementById('replyName').value = '';
                modal.style.display = "none";
            } else {
                document.getElementById('comment').value = '';
                document.getElementById('name').value = '';
            }
            // Загрузить комментарии после добавления нового
            loadComments(); // Ensure you load the correct page
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
