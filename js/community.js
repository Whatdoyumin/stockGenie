document.addEventListener("DOMContentLoaded", function() {
    fetch('./data/communityData.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('community-container');
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');

                const profileImage = document.createElement('img');
                profileImage.src = post.profileImage;
                profileImage.alt = `${post.username}의 프로필 이미지`;
                profileImage.classList.add('profile-image');

                const postContent = document.createElement('div');
                postContent.classList.add('post-content');

                const username = document.createElement('div');
                username.classList.add('username');
                username.textContent = post.username;

                const postDate = document.createElement('div');
                postDate.classList.add('post-date');
                postDate.textContent = post.postDate;

                const content = document.createElement('div');
                content.classList.add('content');
                content.textContent = post.content;

                const interactionContainer = document.createElement('div');
                interactionContainer.classList.add('interaction-container');

                const likes = document.createElement('div');
                likes.classList.add('likes');
                likes.textContent = `❤️ ${post.likes}`;
                likes.addEventListener('click', () => {
                    post.likes++;
                    likes.textContent = `❤️ ${post.likes}`;
                });

                // 댓글 작성 버튼 추가
                const commentButton = document.createElement('button');
                commentButton.classList.add('comment-button');
                commentButton.textContent = '댓글 작성';
                commentButton.addEventListener('click', () => {
                    alert('댓글 작성 버튼이 클릭되었습니다.');
                });

                interactionContainer.appendChild(likes);
                interactionContainer.appendChild(commentButton);

                postContent.appendChild(username);
                postContent.appendChild(postDate);
                postContent.appendChild(content);
                postContent.appendChild(interactionContainer); // interactionContainer 추가

                postElement.appendChild(profileImage);
                postElement.appendChild(postContent);

                // 댓글 섹션 추가
                const commentsSection = document.createElement('div');
                commentsSection.classList.add('comments-section');

                post.comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');

                    const commentProfileImage = document.createElement('img');
                    commentProfileImage.src = comment.profileImage;
                    commentProfileImage.alt = `${comment.username}의 프로필 이미지`;
                    commentProfileImage.classList.add('profile-image');

                    const commentContent = document.createElement('div');
                    commentContent.classList.add('comment-content');

                    const commentUsername = document.createElement('div');
                    commentUsername.classList.add('username');
                    commentUsername.textContent = comment.username;

                    const commentDate = document.createElement('div');
                    commentDate.classList.add('comment-date');
                    commentDate.textContent = comment.commentDate;

                    const commentText = document.createElement('div');
                    commentText.classList.add('content');
                    commentText.textContent = comment.content;

                    commentContent.appendChild(commentUsername);
                    commentContent.appendChild(commentDate);
                    commentContent.appendChild(commentText);

                    commentElement.appendChild(commentProfileImage);
                    commentElement.appendChild(commentContent);

                    commentsSection.appendChild(commentElement);
                });

                postElement.appendChild(commentsSection);

                container.appendChild(postElement);
            });
        });
});
