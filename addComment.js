// addComment.js
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
        loadComments();
    } catch (e) {
        console.error("Ошибка добавления комментария: ", e);
    }
}

function showReplyForm(parentId) {
    const replyForm = document.getElementById('replyForm');
    replyForm.style.display = 'block';
    document.getElementById('replyTo').value = parentId;
}
