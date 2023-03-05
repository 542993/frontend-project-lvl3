import _ from 'lodash';
const parse = (xmlContent, url) => {
  const parser = new DOMParser();
  const htmlContent = parser.parseFromString(xmlContent, 'application/xml');
  console.log(htmlContent);
  const channel = htmlContent.querySelector('channel');
  const decriptionFeed = channel.querySelector('decription');
  const titleFeed = channel.querySelector('title');
  const feed = {
    decription: decriptionFeed,
    title: titleFeed,
    url: url,
    id: _.uniqueId(),
  };
  const posts = Array.from(htmlContent.querySelectorAll('item')).map((item) => {
    const postLink = item.querySelector('link');
    const postDescription = item.querySelector('description');
    const postTitle = item.querySelector('title');
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
