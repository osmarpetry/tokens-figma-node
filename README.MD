## Why I created this project?

I want to have a parser to get design tokens from Figma. I caught the code to parse the code from Figma from [Design Tokens with Figmna](https://blog.prototypr.io/design-tokens-with-figma-aef25c42430f) (the code's author knows).

Then I caught this `Object` then copied to `output/tokens.json`. After it, I parsed the code to separated CSS files with the CSS variables for each Design Token.

With that, I can easily update de CSS variables to SASS, CSS and styled-components. In that way, I can easily update my design tokens on my project.

### How to use

Today I don't have a NodeJS CLI, so you should go to `index.js` replace `figmaApiKey` with your personal Figma key and the `figmaId` from your Id file Figma.

You can see an example of a [Figma project here](https://www.figma.com/file/qVB889G6DBA95XyrvGhwtK/figma-parser?node-id=13%3A151).