import React from 'react';
import { configure, storiesOf, linkTo } from '@kadira/storybook';
import { setCurrentChapter } from './store';
import { cleanStoriesOf } from './utils';
// import { chapterTOC } from './defaults';


export function newStorybook(chapter) {
    const chapterList = chapter.subchapters;
    const storyList = chapter.stories;
    const decoratorList = chapter.decorators;
    return () => {
        const newStory = storiesOf(chapter.name, module);
        decoratorList.forEach(fn => newStory.addDecorator(fn));
        if (chapter.parent || chapterList.length > 0) newStory.add('[.]', chapter.TOC(chapter));
        if (chapter.parent) {
            newStory.add('[..]', chapterSelect(chapter.parent, chapter.name));
        }
        chapterList.forEach((subchapter) => {
            newStory.add(`[${subchapter.name}]`, chapterSelect(subchapter, chapter.name));
        });
        storyList.forEach(({ storyName, getStory }) => {
            newStory.add(storyName, getStory);
        });
    };
}

function rebuildStorybook(currentchapter) {
    configure(newStorybook(currentchapter), module);
}

export function chapterSelect(chapter, prevKindName) {
    return () => {
        const name = chapter.name;
//        storiesOf(prevKindName, modDEL);
        cleanStoriesOf(prevKindName);
        rebuildStorybook(chapter);
        linkTo(chapter.name, '.')();
        setCurrentChapter(chapter);
        return (
          <button onClick={() => { rebuildStorybook(chapter); }}>
            <p>Redirect to {name} chapter</p>
          </button>
        );
    };
}

export function chapterHide(chapter) {
    cleanStoriesOf(chapter.name);
    configure(() => {}, module);
}

export function chapterShow(chapter) {
    rebuildStorybook(chapter);
}
