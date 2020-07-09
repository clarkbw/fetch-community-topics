import * as core from '@actions/core';
import axios from 'axios';

import {ICommunityTopic, IDiscourseTopic} from './interfaces';

function getTopicURL(url: string, slug: string, id: string) {
  return new URL(`/t/${slug}/${id}`, url).href;
}

function getCategoryURL(url: string, slug: string) {
  return new URL(`/c/${slug}.json`, url).href;
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
    core.debug(response.data);

    const allTopics: Array<IDiscourseTopic> = response.data.topic_list.topics;

    let topics: Array<ICommunityTopic> = allTopics.map((t: IDiscourseTopic) => {
      return {
        url: getTopicURL(url, t.slug, t.id),
        excerpt: t.excerpt,
        title: t.title,
        reply_count: t.reply_count,
        pinned: t.pinned,
        has_accepted_answer: t.has_accepted_answer,
        tags: t.tags
      };
    });

    topics = pinned ? topics : topics.filter((t: ICommunityTopic) => !t.pinned);

    topics = unanswered
      ? topics.filter((t: ICommunityTopic) => !t.has_accepted_answer)
      : topics;

    core.setOutput('topics', JSON.stringify(topics));
    core.setOutput('length', topics.length);
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
