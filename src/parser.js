const parse = (data, url) => {
  const parser = new DOMParser();
  const xmlContent = parser.parseFromString(data, 'application/xml');
  const channel = xmlContent.querySelector('channel');
  const parsererror = xmlContent.querySelector('parsererror');
  if (parsererror) {
    const error = new Error();
    error.isParsingError = true;
    throw error;
  }
  const decriptionFeed = channel.querySelector('description').textContent;
  const titleFeed = channel.querySelector('title').textContent;
  const feed = {
    decription: decriptionFeed,
    title: titleFeed,
    url,
  };
  const posts = Array.from(channel.querySelectorAll('item')).map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postTitle = item.querySelector('title').textContent;
    const post = {
      link: postLink,
      description: postDescription,
      title: postTitle,
    };
    return post;
  });
  return { feed, posts };
};
export default parse;
