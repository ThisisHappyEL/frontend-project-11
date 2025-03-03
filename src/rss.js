const parse = (data) => {
  const parser = new DOMParser();
  const rssDOM = parser.parseFromString(data, 'text/xml');

  const parseError = rssDOM.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;
    error.data = data;
    throw error;
  }

  const channelTitleElementDOM = rssDOM.querySelector('channel > title');
  const channelTitle = channelTitleElementDOM.textContent;
  const channelDescriptionElementDOM = rssDOM.querySelector('channel > description');
  const channelDescription = channelDescriptionElementDOM.textContent;

  const newsElements = Array.from(rssDOM.querySelectorAll('item'));
  const news = newsElements.map((item) => {
    const itemTitleDOM = item.querySelector('title');
    const itemDescriptionDOM = item.querySelector('description');
    const itemLinkDOM = item.querySelector('link');

    const itemTitle = itemTitleDOM.textContent;
    const itemDescription = itemDescriptionDOM.textContent;
    const itemLink = itemLinkDOM.textContent;
    return { itemTitle, itemDescription, itemLink };
  });

  return { title: channelTitle, description: channelDescription, news };
};

export default parse;
