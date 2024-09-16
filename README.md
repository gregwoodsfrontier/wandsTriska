# :star2: Wands of Triskaideka 🌟

_An entry for 2024 js13k game jam. Theme is Triskaidekaphobia_

✨ :blush:

Once upon a time, there is a wizard, Trika, who is a freshman in the Deka Academy.

He does not perform well in his class and all his classmates, even his teachers, are all teasing him about how bad and unfit he is.

One day, he wandered into the Lost Woods and found a mysterious wand.

He picked that up, wishing to find its original owner.

However unfortune starts to befall him.....

## Gameplay

- Press :arrow_left: to move left, :arrow_right: to move right
- Press :arrow_up: to jump
- Press `C` to shoot fireballs
- Spikeballs can hurt you now

## Post-mortem (just after the deadline of js13k-2024)

### The beginning

Triskaidekaphobia... How many letters are there ? `(17)`

When the theme pops up, there are several ideas that come to my head.

- 2d platformer but every 13 steps something potentially dangerous approaches you. However it can help you trigger switches or attack enemies.
- Vampire Surviors but it is Ender who wants to hands everybody swags but all people are too busy with their game hence avoiding him.
- Blackjack but you bust at multiples of 13.
- Uno but you lose if the sum of numbers in the discard pile is multiples of 13 after you played.

There are like several ideas but all of them are my first time to try the genre and they are potentially very hard for me to start.
The first idea seems pretty easy to implement so I went with this idea instead.

It is also pretty easy for me to add more elements like fireballs towards the player,
spikes that would appear near proximity of the player,
or even or homing aim where the Trica can get shot by it (and potentially hurt enemies)

### Struggle bus

LittleJS is a new engine to me and I have heard a lot of wonderful things about it. I did my first js13k game (DEATH) using Kontra and I want to give this a try.
So I started reading its example code to understand how to use this engine. I quickly learnt that reading JS code is not fun. :frowning: :frowning:
A lot of props and variables just happen out of thin air without initialization on the same file and I had a hard time tracing it.
I am also a noob in compression, optimisation stuff so I thought I could just go with a LittleJS template and be fine with it.
It took me a week to realise there is no tree-shakable function in those templates.
I immediately went to Vite and embrace Typescript and also the js13k-vite-plugins. Kudos to (Mr. Cody Ebberson)[https://github.com/codyebberson] for such an amazing plugin. :tophat: :tophat: :tophat:

### Review

The end product turns out to be a single room that Trica is at the top and he has to keep moving to spawn spikeballs that break blocks.
The goal is located at the end of the room, the bottom level, so he has to keep breaking blocks to reach.
I also added a shooter so that Trica can push the spikeballs with his magic instead.
But I realised that this game has to be movement-heavy because the mechanics are driven based on movements, or else nothing happens.
Within a lock room, there is not much to move about and I did not include any traps or movables in this build. There is not much time left for my submission.
