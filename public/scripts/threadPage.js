document.addEventListener('DOMContentLoaded', () => {
    const mainThreadPageContainer = document.getElementById('mainThreadPageContainer');
    const comments = document.getElementById('comments');
    const noCommentDiv = document.getElementById('noCommentDiv');
    const postCommentButton = document.getElementById('postCommentButton');

    postCommentButton.addEventListener('click', async () => {
        const threadId = document.getElementById('thread').dataset.threadId;
        const contentValue = document.getElementById('commentInput').value;
        if (contentValue != '') {
            try {
                const response = await fetch('/api/user/create/comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: threadId,
                        content: contentValue
                    })
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                    }
                    throw new Error('Failed to post resource');
                }

                const data = await response.json();

                const html =
                    `
                    <div id="comment${data.comment.id}" class="bg-white w-full rounded-lg p-[20px] my-[10px]">
                        <div class="flex flex-row justify-between w-full mb-[10px]">
                        <div class="flex flex-row w-fit">
                            <a href="/user/${data.author.username}" class="h-full text-purple-500 hover:text-purple-600 flex items-center font-bold">@${data.author.username}</a>
                            <span class="italic text-[15px] font-bold text-gray-500 ml-[10px]">Posted on: ${dateParse(data.comment.createdAt)}</span>
                        </div>
                        <div class="flex flex-row" data-comment-id="${data.comment.id}">
                            <span class="material-symbols-outlined mr-[20px] text-gray-400 hover:text-gray-500 active:text-gray-800 cursor-pointer" onclick="commentReplyButton(event)">reply</span>
                            <span class="material-symbols-outlined hover:text-green-600 active:text-green-800 select-none cursor-pointer" id="commentLike${data.comment.id}" onclick="commentLikeButton(event)">thumb_up</span>
                            <span class="mx-[10px] font-semibold" id="commentcounter<%- comment.id %>">${data.comment.score}</span>
                            <span class="material-symbols-outlined hover:text-red-600 active:text-red-800 select-none cursor-pointer" id="commentDislike${data.comment.id}" onclick="commentDislikeButton(event)">thumb_down</span>
                            <span class="material-symbols-outlined ml-[20px] text-red-600 hover:text-red-700 active:text-red-800 cursor-pointer" id="commentDelete<${data.comment.id}" onclick="deleteComment(event)">delete</span>
                        </div>
                        </div>
                        <div class="text-[16px] italic" id="contents${data.comment.id}">${data.comment.content}</div>
                    </div>
                    `;

                const newDiv = document.createElement('div');
                newDiv.id = `commentandreplies${data.comment.id}`;
                newDiv.innerHTML = html;

                if (noCommentDiv) {
                    noCommentDiv.remove();
                    mainThreadPageContainer.appendChild(newDiv);
                } else {
                    if (comments.children.length > 0) {
                        comments.insertBefore(newDiv, comments.firstChild);
                    } else {
                        comments.appendChild(newDiv);
                    }
                }

            } catch (error) {
                console.error('Error posting resource:', error);
            }
        }
    })
})

async function postReply(commentid, username, type) {
    commentid = parseInt(commentid);
    const contentValue = document.getElementById(`replyInput${commentid}`).value;
    const replies = document.getElementById(`replies${commentid}`);
    if (contentValue != '') {
        try {
            const response = await fetch('/api/user/create/commentreply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: commentid,
                    content: contentValue,
                    username: username
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                }
                throw new Error('Failed to post resource');
            }

            const data = await response.json();

            const html =
                `
                <div class="bg-white w-full rounded-lg p-[20px] my-[10px]">
                    <div class="flex flex-row justify-between w-full mb-[10px]">
                        <div class="flex flex-row w-fit">
                            <a href="/user/${data.author}" class="h-full text-purple-500 hover:text-purple-600 flex items-center font-bold">@${data.author}</a>
                            <span class="italic text-[15px] font-bold text-gray-500 ml-[10px]">Posted on: ${dateParse(data.reply.createdAt)}</span>
                        </div>
                        <div class="flex flex-row" data-comment-id="${data.reply.commentId}" data-reply-id="${data.reply.id}" data-user="${data.author}" data-type="reply">
                            <span class="material-symbols-outlined mr-[20px] text-gray-400 hover:text-gray-500 active:text-gray-800 cursor-pointer select-none" onclick="replyButton(event)">reply</span>
                            <span class="material-symbols-outlined hover:text-green-600 active:text-green-800 select-none cursor-pointer" id="replyLike${data.reply.id}" onclick="replyLikeButton(event)">thumb_up</span>
                            <span class="mx-[10px] font-semibold" id="replycounter${data.reply.id}">${data.reply.score}</span>
                            <span class="material-symbols-outlined hover:text-red-600 active:text-red-800 select-none cursor-pointer" id="replyDislike${data.reply.id}" onclick="replyDislikeButton(event)">thumb_down</span>
                            <span class="material-symbols-outlined ml-[20px] text-red-600 hover:text-red-700 active:text-red-800 cursor-pointer" id="replyDelete${data.reply.id}" onclick="deleteReply(event)">delete</span>
                        </div>
                    </div>
                    <div>
                        <a href="/user/${data.reply.repliedToWhom}" class="text-blue-500 hover:text-blue-600 font-bold">@${data.reply.repliedToWhom}</a>
                        <span class="text-[16px] italic" id="replycontents${data.reply.id}">${data.reply.content}</span>
                    </div>
                </div>
                `;

            const newSpan = document.createElement('span');
            newSpan.id = `reply${data.reply.id}`;
            newSpan.innerHTML = html;

            if (type === 'comment') {
                if (replies.children.length > 0) {
                    replies.insertBefore(newSpan, replies.firstChild);
                } else {
                    replies.appendChild(newSpan);
                }
                document.getElementById(`commentreplybox${commentid}`).style.display = 'none';
            } else {
                const replyid = parseInt(type.split(':')[1]);
                replies.appendChild(newSpan);
                document.getElementById(`replybox${replyid}`).style.display = 'none';
            }

        } catch (error) {
            console.error('Error posting resource:', error);
        }
    }
}

async function fetchReplies(event) {
    const commentid = event.target.dataset.commentId;
    const replies = document.getElementById(`replies${commentid}`);
    try {
        const response = await fetch(`/api/public/fetch/replies?id=${commentid}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to get resource');
        }

        const data = await response.json();

        html = data.map(reply => {
            return `
            <div id="reply${reply.id}" class="bg-white w-full rounded-lg p-[20px] my-[10px]">
                <div class="flex flex-row justify-between w-full mb-[10px]">
                    <div class="flex flex-row w-fit">
                        <a href="/user/${reply.author.username}" class="h-full text-purple-500 hover:text-purple-600 flex items-center font-bold">@${reply.author.username}</a>
                        <span class="italic text-[15px] font-bold text-gray-500 ml-[10px]">Posted on: ${reply.createdAt}</span>
                    </div>
                    <div class="flex flex-row" data-comment-id="${reply.commentId}" data-reply-id="${reply.id}" data-user="${reply.author.username}" data-type="reply">
                        <span class="material-symbols-outlined mr-[20px] text-gray-400 hover:text-gray-500 active:text-gray-800 cursor-pointer select-none" onclick="replyButton(event)">reply</span>
                        <span class="material-symbols-outlined ${typeof reply.liked != 'undefined' ? 'text-green-600' : ''} hover:text-green-600 active:text-green-800 select-none cursor-pointer" id="replyLike${reply.id}" onclick="replyLikeButton(event)">thumb_up</span>
                        <span class="mx-[10px] font-semibold" id="replycounter${reply.id}">${reply.score}</span>
                        <span class="material-symbols-outlined ${typeof reply.disliked != 'undefined' ? 'text-red-600' : ''} hover:text-red-600 active:text-red-800 select-none cursor-pointer" id="replyDislike${reply.id}" onclick="replyDislikeButton(event)">thumb_down</span>
                        ${typeof reply.allowDeletes != 'undefined' && reply.deleted === false ? `<span class="material-symbols-outlined ml-[20px] text-red-600 hover:text-red-700 active:text-red-800 cursor-pointer" id="replyDelete${reply.id}" onclick="deleteReply(event)">delete</span>` : ''}
                    </div>
                </div>
                <div>
                    <a href="/user/${reply.repliedToWhom}" class="text-blue-500 hover:text-blue-600 font-bold">@${reply.repliedToWhom}</a>
                    <span class="text-[16px] italic" id="replycontents${reply.id}">${reply.content}</span>
                </div>
            </div>
        `
        }).join('');

        const newSpan = document.createElement('span');
        newSpan.innerHTML = html;

        replies.appendChild(newSpan);
        replies.querySelector('#viewmore').remove();

    } catch (error) {
        console.error('Error fetching resource:', error);
    }
}

async function threadLikeButton(event) {
    const threadid = event.target.closest('div').dataset.threadId;
    const threadLikeDiv = document.getElementById(`threadLike`);
    const counter = document.getElementById(`thread`).querySelector('#counter');
    try {
        const response = await fetch('/api/user/like/thread', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: threadid
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            }
            throw new Error('Failed to like resource');
        }

        const data = await response.json();

        if (data.message === 0) {
            threadLikeDiv.classList.add('text-green-600');
            counter.textContent = parseInt(counter.textContent) + 1;
        } else if (data.message === 1) {
            threadLikeDiv.classList.remove('text-green-600');
            counter.textContent = parseInt(counter.textContent) - 1;
        } else if (data.message === 3) {
            threadLikeDiv.classList.add('text-green-600');
            document.getElementById(`threadDislike`).classList.remove('text-red-600');
            counter.textContent = parseInt(counter.textContent) + 2;
        }

    } catch (error) {
        console.error('Error liking resource:', error);
    }
}

async function threadDislikeButton(event) {
    const threadid = event.target.closest('div').dataset.threadId;
    const threadDislikeDiv = document.getElementById(`threadDislike`);
    const counter = document.getElementById(`thread`).querySelector('#counter');
    try {
        const response = await fetch('/api/user/dislike/thread', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: threadid
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            }
            throw new Error('Failed to like resource');
        }

        const data = await response.json();

        if (data.message === 0) {
            threadDislikeDiv.classList.add('text-red-600');
            counter.textContent = parseInt(counter.textContent) - 1;
        } else if (data.message === 1) {
            threadDislikeDiv.classList.remove('text-red-600');
            counter.textContent = parseInt(counter.textContent) + 1;
        } else if (data.message === 3) {
            threadDislikeDiv.classList.add('text-red-600');
            document.getElementById(`threadLike`).classList.remove('text-green-600');
            counter.textContent = parseInt(counter.textContent) - 2;
        }

    } catch (error) {
        console.error('Error disliking resource:', error);
    }
}

async function commentLikeButton(event) {
    const commentid = event.target.closest('div').dataset.commentId;
    const commentLikeDiv = document.getElementById(`commentLike${commentid}`);
    const counter = document.getElementById(`commentcounter${commentid}`);
    try {
        const response = await fetch('/api/user/like/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: commentid
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            }
            throw new Error('Failed to like resource');
        }

        const data = await response.json();

        if (data.message === 0) {
            commentLikeDiv.classList.add('text-green-600');
            counter.textContent = parseInt(counter.textContent) + 1;
        } else if (data.message === 1) {
            commentLikeDiv.classList.remove('text-green-600');
            counter.textContent = parseInt(counter.textContent) - 1;
        } else if (data.message === 3) {
            commentLikeDiv.classList.add('text-green-600');
            document.getElementById(`commentDislike${commentid}`).classList.remove('text-red-600');
            counter.textContent = parseInt(counter.textContent) + 2;
        }

    } catch (error) {
        console.error('Error liking resource:', error);
    }
}

async function commentDislikeButton(event) {
    const commentid = event.target.closest('div').dataset.commentId;
    const commentDislikeDiv = document.getElementById(`commentDislike${commentid}`);
    const counter = document.getElementById(`commentcounter${commentid}`);
    try {
        const response = await fetch('/api/user/dislike/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: commentid
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            }
            throw new Error('Failed to like resource');
        }

        const data = await response.json();

        if (data.message === 0) {
            commentDislikeDiv.classList.add('text-red-600');
            counter.textContent = parseInt(counter.textContent) - 1;
        } else if (data.message === 1) {
            commentDislikeDiv.classList.remove('text-red-600');
            counter.textContent = parseInt(counter.textContent) + 1;
        } else if (data.message === 3) {
            commentDislikeDiv.classList.add('text-red-600');
            document.getElementById(`commentLike${commentid}`).classList.remove('text-green-600');
            counter.textContent = parseInt(counter.textContent) - 2;
        }

    } catch (error) {
        console.error('Error disliking resource:', error);
    }
}

async function replyLikeButton(event) {
    const replyid = event.target.closest('div').dataset.replyId;
    const replyLikeDiv = document.getElementById(`replyLike${replyid}`);
    const counter = document.getElementById(`replycounter${replyid}`);
    try {
        const response = await fetch('/api/user/like/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: replyid
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            }
            throw new Error('Failed to like resource');
        }

        const data = await response.json();

        if (data.message === 0) {
            replyLikeDiv.classList.add('text-green-600');
            counter.textContent = parseInt(counter.textContent) + 1;
        } else if (data.message === 1) {
            replyLikeDiv.classList.remove('text-green-600');
            counter.textContent = parseInt(counter.textContent) - 1;
        } else if (data.message === 3) {
            replyLikeDiv.classList.add('text-green-600');
            document.getElementById(`replyDislike${replyid}`).classList.remove('text-red-600');
            counter.textContent = parseInt(counter.textContent) + 2;
        }

    } catch (error) {
        console.error('Error liking resource:', error);
    }
}

async function replyDislikeButton(event) {
    const replyid = event.target.closest('div').dataset.replyId;
    const replyDislikeDiv = document.getElementById(`replyDislike${replyid}`);
    const counter = document.getElementById(`replycounter${replyid}`);
    try {
        const response = await fetch('/api/user/dislike/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: replyid
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = `/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            }
            throw new Error('Failed to like resource');
        }

        const data = await response.json();

        if (data.message === 0) {
            replyDislikeDiv.classList.add('text-red-600');
            counter.textContent = parseInt(counter.textContent) - 1;
        } else if (data.message === 1) {
            replyDislikeDiv.classList.remove('text-red-600');
            counter.textContent = parseInt(counter.textContent) + 1;
        } else if (data.message === 3) {
            replyDislikeDiv.classList.add('text-red-600');
            document.getElementById(`replyLike${replyid}`).classList.remove('text-green-600');
            counter.textContent = parseInt(counter.textContent) - 2;
        }

    } catch (error) {
        console.error('Error disliking resource:', error);
    }
}

async function replyButton(event) {
    const commentid = event.target.closest('div').dataset.commentId;
    const type = event.target.closest('div').dataset.type;
    const username = event.target.closest('div').dataset.user;

    const newSpan = document.createElement('span');
    newSpan.classList.add('w-full', 'relative');

    let element;
    const replyid = event.target.closest('div').dataset.replyId;
    if (type === 'reply') {
        element = document.getElementById(`${type}${replyid}`);
        newSpan.id = `replybox${replyid}`;
    } else if (type === 'comment') {
        element = document.getElementById(`${type}${commentid}`);
        newSpan.id = `commentreplybox${commentid}`;
    }

    const span = document.getElementById(newSpan.id);

    if (!span) {
        const html =
            `
            <div class="absolute pl-[5px] pt-[25px]"><span class="font-bold text-blue-500 w-fit">@${username}</span></div>
            <textarea id="replyInput${commentid}" maxlength="300" placeholder="Write a reply..." class="focus:bg-gray-50 border border-gray-300 pt-[30px] mt-[20px] pl-[5px] rounded-md resize-none w-full overflow-y-hidden placeholder-gray-400 text-[16px] italic outline-none"></textarea>
            <div class="w-full flex justify-end">
                <button type="button" class="border border-gray-300 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-full font-semibold px-[10px] py-[5px] flex items-center justify-center" onclick="postReply(${commentid}, '${username}', ${type === 'reply' ? '\'reply:' + replyid + '\'' : '\'comment\''})">Send<span class="material-symbols-outlined ml-[5px]">send</span></button>
            </div>
            `;

        newSpan.innerHTML = html;

        element.append(newSpan);
    } else {
        if (span.classList.contains('hidden'))
            span.classList.remove('hidden');
        else
            span.classList.add('hidden');
    }
}

function deleteThread(event) {
    const threadid = event.target.closest('div').dataset.threadId;
    console.log(threadid);
    const urlWithParams = `/api/user/delete/thread/${threadid}`;
    fetch(urlWithParams, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 0) {
                document.getElementById('threadDelete').remove();
                document.getElementById('contents').innerHTML =
                    `
                    <div class="text-[20px] italic font-bold mt-[20px]">[Content Deleted]</div>
                `;
            } else if (data.message === 1) {
                window.location.href = (window.location.pathname).split('/th')[0];
            } else if (data.message === 2) {
                throw Error('Process failed');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteComment(event) {
    const commentid = event.target.closest('div').dataset.commentId;
    const urlWithParams = `/api/user/delete/comment/${commentid}`;
    fetch(urlWithParams, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 0) {
                document.getElementById(`commentDelete${commentid}`).remove();
                document.getElementById(`contents${commentid}`).innerHTML =
                    `
                    <div class="text-[20px] italic font-bold mt-[20px]">[Content Deleted]</div>
                `;
            } else if (data.message === 1) {
                document.getElementById(`commentandreplies${commentid}`).remove();
            } else if (data.message === 2) {
                throw Error('Process failed');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteReply(event) {
    const replyid = event.target.closest('div').dataset.replyId;
    console.log(replyid);
    const urlWithParams = `/api/user/delete/reply/${replyid}`;
    fetch(urlWithParams, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 0) {
                document.getElementById(`replyDelete${replyid}`).remove();
                document.getElementById(`replycontents${replyid}`).innerHTML =
                    `
                    <div class="text-[20px] italic font-bold mt-[20px]">[Content Deleted]</div>
                `;
            } else if (data.message === 1) {
                document.getElementById(`reply${replyid}`).remove();
            } else if (data.message === 2) {
                throw Error('Process failed');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function dateParse(createdAt) {
    const parsedDate = new Date(createdAt);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    const formattedDate = parsedDate.toLocaleString('en-US', options);
    return formattedDate;
}