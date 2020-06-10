import * as core from '@actions/core';
import axios from 'axios';

function getTopicURL(url: string, slug: string, id: string) {
  return `${url}/t/${slug}/${id}`;
}

function getCategoryURL(url: string, slug: string) {
  return `${url}/c/${slug}.json`;
}

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url');
    const slug: string = core.getInput('slug', {required: true});
    const unanswered: boolean = !!!core.getInput('unanswered');

    const response = await axios.get(getCategoryURL(url, slug));

    const all: Array<object> = response.data.topic_list.topics
      .filter((t: any) => !!!t.pinned)
      .map((t: any) => {
        return {
          url: getTopicURL(url, t.slug, t.id),
          excerpt: t.excerpt,
          title: t.title,
          reply_count: t.reply_count
        };
      });

    const topics = unanswered
      ? all.filter((t: any) => !!!t.has_accepted_answer)
      : all;

    core.setOutput('topics', JSON.stringify(topics));
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
