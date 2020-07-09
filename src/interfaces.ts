// subset of the IDiscourseTopic
// type CommunityTopic = Pick<
//   IDiscourseTopic,
//   | 'url'
//   | 'excerpt'
//   | 'title'
//   | 'reply_count'
//   | 'pinned'
//   | 'has_accepted_answer'
//   | 'tags'
// >;
interface ICommunityTopic {
  url: string;
  excerpt: string;
  title: string;
  reply_count: number;
  pinned: boolean;
  has_accepted_answer: boolean;
  tags: Array<string>;
}

interface IDiscourseTopicPoster {
  extras: any;
  description: string;
  user_id: number;
  primary_group_id: number;
}

interface IDiscourseTopic {
  id: string;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  image_url: string;
  created_at: Date;
  last_posted_at: Date;
  bumped: true;
  bumped_at: Date;
  archetype: string;
  unseen: boolean;
  pinned: boolean;
  unpinned: string;
  excerpt: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked: string;
  liked: string;
  thumbnails: string;
  tags: Array<string>;
  views: number;
  like_count: number;
  has_summary: boolean;
  last_poster_username: string;
  category_id: number;
  pinned_globally: boolean;
  featured_link: string;
  has_accepted_answer: boolean;
  vote_count: number;
  can_vote: boolean;
  user_voted: string;
  posters: Array<IDiscourseTopicPoster>;
}

export {ICommunityTopic, IDiscourseTopicPoster, IDiscourseTopic};
