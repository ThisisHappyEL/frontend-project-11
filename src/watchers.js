import onChange from 'on-change';

// const state = {
//   lng: 'ru',
//   currentFeeds: [],
//   urlForm: {
//     stateError: null,
//     urlValid: false,
//   },
// };

// const elements = {
//   form: document.querySelector('.rss-form'),
//   invalidUrlMessage: document.querySelector('.text-danger'),
//   input: document.querySelector('#url-input'),
// };

export default (state, elements) => {
  const errorForm = () => {
    const { input, invalidUrlMessage } = elements;

    if (state.urlForm.stateError) {
      invalidUrlMessage.textContent = state.urlForm.stateError;
    } else {
      invalidUrlMessage.textContent = '';

      setTimeout(() => {
        input.value = '';
        input.focus();
      }, 0);
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'urlForm':
        errorForm();
        break;
      default:
        break;
    }
  });

  return watchedState;
};
