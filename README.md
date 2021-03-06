<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Discourse Topics Action

This is a composible Action for pulling topics from a [GitHub Discourse Community](https://github.community/) category using the [Discourse Categories API](https://docs.discourse.org/#tag/Categories/paths/~1categories.json/post).

Use like this:

```yml
    - uses: clarkbw/fetch-community-topics@main
      with: 
        slug: 'github-packages/43'
```

And you'll be given an array of objects as output into the `topics` object.

```json
[
{
  "url": "https://github.community/t/topic/id",
  "excerpt": "excerpt provided by the API",
  "title": "title of the topic",
  "reply_count": 100
}
]
```

Control for and use the output for another step:

```yml
  steps:
    - uses: clarkbw/fetch-community-topics@main
      id: community
      with: 
        slug: 'github-packages/43'
    - name: Docker stuff # only run this step if the title contains the word 'docker'
      if: ${{ contains(steps.community.outputs.topics.*.title, 'docker') }}
      run: echo ${{ steps.community.outputs.topics.*.url }} # echo an array of URLs only
```

Use the output of only URLs for another job:

```yml
name: build
on: push
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      topic-urls: ${{ steps.community.outputs.topics.*.url }}
    steps:
    - uses: clarkbw/fetch-community-topics@main
      id: community
      with: 
        slug: 'github-packages/43'
  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps:
    - run: build ${{fromJson(needs.job1.outputs.topic-urls)}}
```

Currently we ignore pinned topics but we might provide an option for that or include it in the payload so you can filter it out later.

# Development

Here are instructions for development which haven't seen much testing.

## Code in Master

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run pack
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run pack
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml)])

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
