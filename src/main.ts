import * as core from '@actions/core';
import axios from 'axios';

function getTopicURL(url: string, slug: string, id: string) {
  return new URL(`/t/${slug}/${id}`, url).href;
}

function getCategoryURL(url: string, slug: string) {
  return new URL(`/c/${slug}.json`, url).href;
}

interface CommunityTopic {
  url: string;
  excerpt: string;
  title: string;
  reply_count: number;
  pinned: boolean;
  has_accepted_answer: boolean;
}

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url');
    const slug: string = core.getInput('slug', {required: true});
    const unanswered: boolean = JSON.parse(
      core.getInput('unanswered').toLowerCase()
    );
    const pinned: boolean = JSON.parse(core.getInput('pinned').toLowerCase());

    const response = await axios.get(getCategoryURL(url, slug));

    let topics: Array<CommunityTopic> = response.data.topic_list.topics.map(
      (t: any) => {
        return {
          url: getTopicURL(url, t.slug, t.id),
          excerpt: t.excerpt,
          title: t.title,
          reply_count: t.reply_count,
          pinned: t.pinned,
          has_accepted_answer: t.has_accepted_answer
        };
      }
    );

    topics = pinned ? topics : topics.filter((t: CommunityTopic) => !t.pinned);

    topics = unanswered
      ? topics.filter((t: CommunityTopic) => !t.has_accepted_answer)
      : topics;

    core.setOutput('topics', JSON.stringify(topics));
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
