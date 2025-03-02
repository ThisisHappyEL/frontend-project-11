import onChange from 'on-change';

export default (state, elements, i18n) => {
  const errorForm = () => {
    const { urlForm: { stateError, urlValid } } = state;
    const { input, feedbackInscription } = elements;

    if (urlValid) {
      if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid');
      }
    } else {
      input.classList.add('is-invalid');
      feedbackInscription.classList.add('text-danger');
      feedbackInscription.textContent = i18n.t(stateError);
    }
  };

  const handleLoadingProcessStatus = () => {
    const { loadingProcess } = state;
    const { submit, input, feedbackInscription } = elements;

    switch (loadingProcess.status) {
      case 'failed':
        submit.disable = false;
        input.removeAttribute('readonly');
        feedbackInscription.classList.add('text-danger');
        feedbackInscription.textContent = i18n.t([`errors.${loadingProcess.error}`, 'error.unknown']);
        break;
      case 'loading':
        submit.disable = true;
        input.setAttribute('readonly', true);
        feedbackInscription.classList.remove('text-success');
        feedbackInscription.classList.remove('text-danger');
        feedbackInscription.textContent = '';
        break;
      case 'idle':
        submit.disable = false;
        input.removeAttribute('readonly');
        input.value = '';
        feedbackInscription.classList.add('text-success');
        feedbackInscription.textContent = i18n.t('succesfully');
        input.focus();
        break;
      default:
        throw new Error(`Unknown loadingProcess status: '${loadingProcess.status}'`);
    }
  };

  const handleFeeds = () => {
    const { currentFeeds } = state;
    const { feedsMain } = elements;

    const feedsBlock = document.createElement('div');
    feedsBlock.classList.add('card', 'border-0');

    const feedsInscriptionBlock = document.createElement('div');
    feedsInscriptionBlock.classList.add('card-body');
    feedsBlock.appendChild(feedsInscriptionBlock);

    const feedInscription = document.createElement('h2');
    feedInscription.classList.add('card-title', 'h4');
    feedInscription.textContent = i18n.t('feeds');
    feedsInscriptionBlock.appendChild(feedInscription);

    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'border-0', 'rounded-0');
    feedsBlock.appendChild(feedsList);

    const feeds = currentFeeds.map((feed) => {
      const listElement = document.createElement('li');
      listElement.classList.add('list-group-item', 'border-0', 'border-end-0');

      const title = document.createElement('h3');
      title.classList.add('h6', 'm-0');
      title.textContent = feed.title;

      const newsDescription = document.createElement('p');
      newsDescription.classList.add('m-0', 'small', 'text-black-50');
      newsDescription.textContent = feed.description;

      listElement.append(title, newsDescription);
      return listElement;
    });
    feedsList.append(...feeds);

    feedsMain.innerHTML = '';
    feedsMain.appendChild(feedsBlock);
  };

  const handlePosts = () => {
    const { postsMain } = elements;

    const postsBlock = document.createElement('div');
    postsBlock.classList.add('card', 'border-0');

    const postsInscriptionBlock = document.createElement('div');
    postsInscriptionBlock.classList.add('card-body');
    postsBlock.appendChild(postsInscriptionBlock);

    const postsIncription = document.createElement('h2');
    postsIncription.classList.add('card-title', 'h4');
    postsIncription.textContent = i18n.t('posts');
    postsInscriptionBlock.appendChild(postsIncription);

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');
    postsBlock.appendChild(postsList);

    const posts = state.posts.map((post) => {
      const listElement = document.createElement('li');
      listElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const link = document.createElement('a');
      link.href = post.url;
      link.classList.add('fw-bold');
      link.dataset.id = post.id;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = post.itemTitle;

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.dataset.id = post.id;
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = i18n.t('view');

      listElement.append(link, button);
      return listElement;
    });
    postsList.append(...posts);

    postsMain.innerHTML = '';
    postsMain.appendChild(postsBlock);
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'urlForm':
        errorForm();
        break;
      case 'loadingProcess.status':
        handleLoadingProcessStatus();
        break;
      case 'currentFeeds':
        handleFeeds();
        break;
      case 'posts':
        handlePosts();
        break;
      default:
        break;
    }
  });

  return watchedState;
};
