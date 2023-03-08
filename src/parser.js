import _ from 'lodash';

const parse = (xmlContent, url) => {
  const parser = new DOMParser();
  const htmlContent = parser.parseFromString(xmlContent, 'application/xml');
  const channel = htmlContent.querySelector('channel');
  const decriptionFeed = channel.querySelector('description').textContent;
  const titleFeed = channel.querySelector('title').textContent;
  const feed = {
    decription: decriptionFeed,
    title: titleFeed,
    url,
    id: _.uniqueId(),
  };
  const posts = Array.from(channel.querySelectorAll('item')).map((item) => {
    const postLink = item.querySelector('link');
    const postDescription = item.querySelector('description').textContent;
    const postTitle = item.querySelector('title').textContent;
    const post = {
      link: postLink,
      description: postDescription,
      title: postTitle,
      postId: _.uniqueId(),
      feedId: feed.id,
    };
    return post;
  });
  return { feed, posts };
};
export default parse;
