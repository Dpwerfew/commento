document.addEventListener("DOMContentLoaded", function () {
    const db = firebase.firestore();
    const auth = firebase.auth();

    async function showAdminComments() {
        try {
            const adminCommentsContainer = document.getElementById('admin-comments-container');
            adminCommentsContainer.innerHTML = '';

            const snapshot = await db.collection('comments').orderBy('timestamp').get();

            snapshot.forEach(doc => {
                const comment = doc.data();
                const commentElement = document.createElement('div');
                commentElement.classList.add('admin-comment');
                commentElement.setAttribute('data-id', doc.id);
                commentElement.innerHTML = `
                    <p><strong>${comment.name || 'Аноним'}</strong> ${new Date(comment.timestamp.toDate()).toLocaleString()}</p>
                    <p>${comment.text}</p>
                    <button onclick="deleteComment('${doc.id}')">Удалить</button>
                `;
                adminCommentsContainer.appendChild(commentElement);
            });

        } catch (e) {
            console.error("Ошибка загрузки комментариев для админки: ", e);
        }
    }

    window.showAdminComments = showAdminComments;

    async function deleteComment(commentId) {
        if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
            try {
                await db.collection('comments').doc(commentId).delete();
                alert('Комментарий удален');
                showAdminComments(); // Обновить список комментариев после удаления
            } catch (e) {
                console.error("Ошибка удаления комментария: ", e);
            }
        }
    }

    window.deleteComment = deleteComment;

    async function adminLogin() {
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (e) {
            document.getElementById('login-error').innerText = 'Ошибка входа: ' + e.message;
        }
    }

    window.adminLogin = adminLogin;

    async function adminLogout() {
        try {
            await auth.signOut();
            document.getElementById('admin-panel').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        } catch (e) {
            console.error("Ошибка выхода: ", e);
        }
    }

    window.adminLogout = adminLogout;

    auth.onAuthStateChanged(user => {
        if (user) {
            // Пользователь вошел в систему
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            showAdminComments();
        } else {
            // Пользователь вышел из системы
            document.getElementById('admin-panel').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        }
    });
});
