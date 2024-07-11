// loadComments.js
let commentsPerPage = 10;
let currentPage = 1;
let totalComments = 0;

async function loadComments(page = 1) {
    currentPage = page;
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = '';
    
    try {
        const querySnapshot = await db.collection("comments").orderBy("timestamp", "asc").get();
        totalComments = querySnapshot.size;
        const totalPages = Math.ceil(totalComments / commentsPerPage);
        const start = (currentPage - 1) * commentsPerPage;
        const end = start + commentsPerPage;

        const comments = {};
        querySnapshot.docs.slice(start, end).forEach((doc) => {
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

        renderPagination(totalPages);
    } catch (error) {
        console.error("Error loading comments: ", error);
    }
}

function renderPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => loadComments(i);
        paginationDiv.appendChild(pageButton);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadComments();
});
