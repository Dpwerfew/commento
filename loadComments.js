// loadComments.js
document.addEventListener("DOMContentLoaded", function () {
    const db = firebase.firestore();

    async function loadComments(page = 1, commentsPerPage = 10) {
        try {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = '';

            const snapshot = await db.collection('comments').orderBy('timestamp').get();
            const totalComments = snapshot.docs.length;
            const totalPages = Math.ceil(totalComments / commentsPerPage);

            const start = (page - 1) * commentsPerPage;
            const end = start + commentsPerPage;

            const comments = snapshot.docs.slice(start, end);

            comments.forEach(doc => {
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

            renderPagination(page, totalPages);
        } catch (e) {
            console.error("Ошибка загрузки комментариев: ", e);
        }
    }

    function renderPagination(currentPage, totalPages) {
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.onclick = () => loadComments(i);
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            paginationContainer.appendChild(pageButton);
        }

        document.body.appendChild(paginati
