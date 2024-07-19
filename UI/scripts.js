const apiUrl = "https://b9w315cd65.execute-api.us-east-1.amazonaws.com/test/"


// Function to show/hide the loading spinner
function toggleSpinner(show) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = show ? 'flex' : 'none';
}
document.getElementById('logoutButton').addEventListener('click', () => {
    // Perform logout logic here, such as clearing tokens or redirecting to the login page
    console.log('Logout button clicked');
    
    // Remove userEmail from sessionStorage or localStorage
    sessionStorage.removeItem('userEmail'); // or localStorage.removeItem('userEmail');

    // Redirect to login page or home page
    window.location.href = 'login.html'; // Adjust the URL as needed
});


// Function to fetch questions from the API
function fetchQuestions() {
    const email = sessionStorage.getItem('userEmail');
    toggleSpinner(true);
    fetch(`${apiUrl}/allquestions`)
        .then(response => response.json())
        .then(data => {
            displayQuestions(data, email);
            toggleSpinner(false);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            toggleSpinner(false);
        });
}

// Function to display questions
function displayQuestions(questions, userEmail) {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = ''; // Clear the list

    questions.forEach(question => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';

        const card = document.createElement('div');
        card.className = 'card';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between align-items-center';

        const questionText = document.createElement('h5');
        questionText.textContent = question.question;
        questionText.className = 'font-weight-bold';

        const meta = document.createElement('div');
        meta.className = 'text-right';

        const emailText = document.createElement('p');
        emailText.textContent = question.email;
        emailText.className = 'mb-0';

        const timeText = document.createElement('p');
        timeText.textContent = new Date(question.time).toLocaleString();
        timeText.className = 'text-muted mb-0';

        meta.appendChild(emailText);
        meta.appendChild(timeText);

        header.appendChild(questionText);
        header.appendChild(meta);

        cardBody.appendChild(header);

        if (question.image_paths && question.image_paths.length > 0) {
            question.image_paths.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = 'Question Image';
                img.className = 'img-fluid mt-3';
                cardBody.appendChild(img);
            });
        }

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'd-flex justify-content-start mt-3';

        const addCommentButton = document.createElement('button');
        addCommentButton.className = 'btn btn-primary';
        addCommentButton.style.marginRight = '10px';
        addCommentButton.textContent = 'Add Comment';
        addCommentButton.onclick = () => showCommentBox(question.question_id);

        const viewCommentsButton = document.createElement('button');
        viewCommentsButton.className = 'btn btn-secondary';
        viewCommentsButton.textContent = 'View Comments';
        viewCommentsButton.style.marginRight = '10px';
        viewCommentsButton.onclick = () => toggleCommentsSection(question.question_id);

        buttonsContainer.appendChild(addCommentButton);
        buttonsContainer.appendChild(viewCommentsButton);

        // Add Delete button if the user email matches the question email
        if (userEmail === question.email) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteQuestion(question.question_id, question.email, listItem);
            buttonsContainer.appendChild(deleteButton);
        }

        cardBody.appendChild(buttonsContainer);

        const commentBox = document.createElement('div');
        commentBox.id = `commentBox-${question.question_id}`;
        commentBox.className = 'mt-3';
        commentBox.style.display = 'none';

        const commentInput = document.createElement('textarea');
        commentInput.className = 'form-control mb-2';
        commentInput.placeholder = 'Enter your comment here';

        const submitCommentButton = document.createElement('button');
        submitCommentButton.className = 'btn btn-success';
        submitCommentButton.textContent = 'Submit';
        submitCommentButton.onclick = () => submitComment(question.question_id, commentInput.value);

        commentBox.appendChild(commentInput);
        commentBox.appendChild(submitCommentButton);

        cardBody.appendChild(commentBox);

        const commentsSection = document.createElement('div');
        commentsSection.id = `commentsSection-${question.question_id}`;
        commentsSection.className = 'mt-3';
        commentsSection.style.display = 'none';

        if (question.answers && question.answers.length > 0) {
            question.answers.forEach(answer => {
                const commentItem = document.createElement('div');
                commentItem.className = 'mb-2';

                const commentText = document.createElement('p');
                commentText.textContent = answer.answer;

                const commentMeta = document.createElement('div');
                commentMeta.className = 'text-muted small';
                commentMeta.textContent = `By: ${answer.email} on ${new Date(answer.time).toLocaleString()}`;

                commentItem.appendChild(commentText);
                commentItem.appendChild(commentMeta);

                commentsSection.appendChild(commentItem);
            });
        } else {
            commentsSection.textContent = 'No comments yet.';
        }

        cardBody.appendChild(commentsSection);

        card.appendChild(cardBody);
        listItem.appendChild(card);
        questionsList.appendChild(listItem);
    });
}

function deleteQuestion(questionId, email, listItem) {
    const url = `${apiUrl}/delete/?question_id=${questionId}&user_email=${email}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Question deleted successfully');
            // Remove the question from the list
            listItem.remove();
        } else {
            console.error('Failed to delete the question');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showCommentBox(questionId) {
    const commentBox = document.getElementById(`commentBox-${questionId}`);
    commentBox.style.display = commentBox.style.display === 'none' ? 'block' : 'none';
}

function toggleCommentsSection(questionId) {
    const commentsSection = document.getElementById(`commentsSection-${questionId}`);
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

function submitComment(questionId, comment) {
    const email = sessionStorage.getItem('userEmail');
    if (!email) {
        alert('You must be logged in to comment.');
        return;
    }

    toggleSpinner(true);
    fetch(`${apiUrl}/answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question_id: questionId,
            email: email,
            answer: comment
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Answer posted successfully') {
            
            document.getElementById(`commentBox-${questionId}`).style.display = 'none';
            const commentsSection = document.getElementById(`commentsSection-${questionId}`);

            if (commentsSection.textContent === 'No comments yet.') {
                commentsSection.textContent = '';
            }

            const commentItem = document.createElement('div');
            commentItem.className = 'mb-2';

            const commentText = document.createElement('p');
            commentText.textContent = comment;

            const commentMeta = document.createElement('div');
            commentMeta.className = 'text-muted small';
            commentMeta.textContent = `By: ${email} on ${new Date().toLocaleString()}`;

            commentItem.appendChild(commentText);
            commentItem.appendChild(commentMeta);

            commentsSection.appendChild(commentItem);
            commentsSection.style.display = 'block';
        } else {
            alert('Failed to post comment');
        }
        toggleSpinner(false);
    })
    .catch(error => {
        console.error('Error posting comment:', error);
        alert('Error posting comment');
        toggleSpinner(false);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'login.html';
    }

    fetchQuestions();
});

document.getElementById('questionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const body = document.getElementById('questionBody').value;
    const image = document.getElementById('questionImage').files[0];
    const userEmail = sessionStorage.getItem('userEmail');

    const reader = new FileReader();
    reader.onloadend = function () {
        const imageBase64 = reader.result.split(',')[1];

        const questionData = {
            question: body,
            email: userEmail,
            image: image ? [imageBase64] : []
        };

        toggleSpinner(true);
        fetch(`${apiUrl}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        })
        .then(response => response.json())
        .then(data => {
            
            fetchQuestions();
            toggleSpinner(false);
        })
        .catch(error => {
            console.error('Error:', error);
            toggleSpinner(false);
        });

        document.getElementById('questionForm').reset();
    };

    if (image) {
        reader.readAsDataURL(image);
    } else {
        const questionData = {
            question: body,
            email: userEmail,
            image: []
        };

        toggleSpinner(true);
        fetch(`${apiUrl}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        })
        .then(response => response.json())
        .then(data => {
        
            fetchQuestions();
            toggleSpinner(false);
        })
        .catch(error => {
            console.error('Error:', error);
            toggleSpinner(false);
        });

        document.getElementById('questionForm').reset();
    }
});
