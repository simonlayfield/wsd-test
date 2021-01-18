# Wall Street Docs Tech Test

### Run the things

```
git clone https://github.com/simonlayfield/wsd-test.git
cd wsd-test
npm install
node server.js
```

The project will then be running at `http://localhost:3000`.

To compile sass there's a grunt watch task that you can run as default by using `grunt` within the project dir.

### Thoughts and considerations

Firstly, I was disappointed not to have taken this test further, but as it stands I used up much more time than I/you would have wanted on getting this far.

As it stands there are only two donut graphs that display, one for each of two services shown within the data. You can technically switch between the data sets but of course the UI doesn't exactly change to a full extent in such an incomplete state.

I used EJS as a view engine, which seemed reasonable enough to me but I'm unsure whether this broke the rules of the spec so if that is the case, apologies.

I have to say that without a frontend framework with which to handle reactivity I found myself a little uncomfortable - I dare say out of my depth which saddens me to say. Unfortunately I don't have a wealth of hardened experience working with pure JS to navigate the pitfalls of managing UI state, which added time to my efforts. I also got a little stuck on what to do with the delay in waiting for data from the API to be ready - I got CORS issues when attempting to handle it on the client, and so ended up moving forward by only rendering the view one the data had be received; a pretty poor user experience but decided to move past it rather than stay blocked on what to do for a solution.

I chose Chart.js for displaying the donut charts, which I must say was probably the easiest part of it all and thankfully gave me some chart animations for free. Still, you'll see there's still additional work that would need to be done to make them look and feel more meaningful - the legend and number indicators on hover feel a bit lost.

There's also some general project architecture that's missing. As you can see everything has been poured in to `app.js` and would soon get a little labrynthine to navigate, so some learning to be done there too.

All in all, I'm glad I gave it a shot and thanks for the opportinity to take the challenge.
