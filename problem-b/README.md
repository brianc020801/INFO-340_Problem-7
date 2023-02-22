# Problem: Pet Adoption (Interactive)

In this exercise you will practice developing a React application with components, props, state, and events. You will do this by converting an existing "static" website into a dynamic one.

Specifically, you will be implementing a dynamic website supporting pet adoption (like at an animal shelter). You can see what the website will look like by opening up the **`pets-mockup/index.html`** file in a browser: you will produce a dynamic, interactive version of this site using React.

## Running the Program
Because this app is created with React (and scaffolded through [Create React App](https://github.com/facebook/create-react-app)), you will need to install dependencies and run a developer web server in order to transpile and view the application. You can run this server by using the command:

```bash
# change directory to problem folder (this directory)
cd path/to/problem

# install dependencies
npm install  # only once

# run the server
npm start
```

You can then view the rendered page _in a web browser_. Remember to check the Developer console for any errors!

## Exercise Instructions
To complete the exercise, edit the included files in **`src/component/`** and add in the required code. Note that you should ___NOT___ edit any of the other provided files (including `index.html`).

**Background**: The first step to creating a React app is determining what components your page will need. One good way to do this is to start with a _static_ version of the page (e.g., pure HTML/CSS) and try and break it up into different "parts". These will often correspond to semantic sectioning or `<div>` elements. 

- Think about what "boxes" you would break the page up into!

You can then convert each of these parts into a React Component, as detailed below:

1. First, implement a component **`App`** (inside of `src/components/App.js`) that will represent the "overall" application. This component will be responsible for representing the _outline_ of the page: think everything inside the `<body>` (though major sections will be defined by other components to keep things separated).

    The `App` component function should return DOM for the main "page structure" found in the `pets-mockup/index.html` file (you can and should copy-and-paste from that html file into JSX!). This should include the `<header>`, `<main>`, and `<footer>` sections. _DO_ include the `#navs` and `#petList` divs, but _DO NOT_ include the contents of those divs&mdash;that content will be defined by separate components later.
    
    - Remember to change all the `class` attributes into `className` attributes.

    This should allow you to see the header and footer of the page.

2. While the Bootstrap framework is imported in the `public/index.html` file from a CDN, the custom CSS file will also need to be included in your app. Luckily, Create React App's webpack configuration supports the ability to `import` CSS files directly into the app!

    Copy the `style.css` file into the app's `src/` folder, and then `import` the file (in `index.js`). You will need to include the full filename (with `.css` extension). This import should NOT be assigned a name (since it isn't a variable you want to reference later).

    This should cause the header to become the correct shade of blue.

3. The next component of your app you should add is the "About" navigation links. Inside the **`src/components/Navigation.js`** file, implement a component **`AboutNav`** that will render the contents of that `<nav>` element (again, copy-and-paste from the `pets-mockup/index.html` file).

    You will need to `import` the `React` component at the top of each file for the module to include JSX.

    Modify the `App` component so that it renders an instance of the `<AboutNav>` in the appropriate spot in the DOM structure. You will need to `export` the `AboutNav` component from `Navigation.js`, and then `import` it (as a named import) in `App.js`.

    Your page should now show that list of links.

4. The remainder of the application will be dynamically generated based on the pets currently available for adoption&mdash;for example the "Breeds" navigation will only include links to breeds that are currently in the shelter.

    The provided `index.js` file has imported a JSON file containing some sample pets, and passes this data to the `<App>` as a **`pets`** prop.

    (Normally you would want to load the data dynamically through an effect hook, but it is being passed in as a prop for testing).

    Visually confirm that the data has been imported in the `index.js` file and is passed as a prop to the instantiated `<App>`. You should then realize that you can access this data as `props.pets` inside the `App` component. Otherwise there is no code you need to write for this step!

5. Inside the `Navigation.js` file, implement a **`BreedNav`** component that will represent the "Breeds" navigation links. This component should accept a prop called **`breeds`** that is an _array of unique strings_ (pet breeds), and render a link for each element in the array.

    - You can copy the `<nav>` element, heading, and structure from the mockup `index.html`.

    - Use the `.map()` function to map the `breeds` prop to an array of `<li>` elements, each including an `<a>` element showing the name of the breed (they can link to nowhere with `href=""`). Remember to give each `<li>` element a `key` attribute!

    Next, modify the `App` component so that it renders the `<BreedNav>` element in the correct place in the DOM hierarchy. You will need to pass it an array of breed names (strings) as a `breeds` prop, which you should get from the `props.pets` array. You will need to `export` the `BreedNav` component from `Navigation.js`, and then `import` it (as a named import) in `App.js`

    - You will need to get the list of unique breed names from the `props.pets` array so you don't include the same link twice. You can just loop through the array and add each unique breed to a list; the `reduce()` function would be great for this. You may also get a lot of milage from the [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) data type. 
    
        Alternatively, you can create a unique list using Lodash's [`.groupBy()`](https://lodash.com/docs/4.17.15#groupBy) function. You will need to `import` the Lodash library (e.g., with `import _ from 'lodash'`), which has already been included and downloaded as a dependency. Check the linked documentation for the function to determine how to group elements in an array by a particular property (it will be like the second example, but using the `breed` property instead of the `length` property). You can then use the `Object.keys()` function to extract the keys of that object (which will be the breeds) as an array.

    When completed, this step should cause the navigation to appear with links to the 4 different breeds.
    
6. The next step is to fill in the cards representing the different pets to adopt. Because you want to repeat the same "card" structure multiple times, it makes sense to make a component that can be instantiated multiple times. Inside the **`src/components/PetList.js`** file, implement a **`PetCard`** component that will represent a card showing a *single* pet's data (which will be passed in as a _prop_ e.g., `petData`. This prop's value will be an Object like one in the `dogs.json` array).

    - You can copy-and-paste the HTML for a card from the mockup `index.html` file. Each card in the example has the same structure, just different content values.

    - Be sure and give the `<img>` an `alt` attribute that is the pet's name (reference the value from the _prop_)!

    - **Note** You will need to copy the `img/` directory from the `pets-mockup` into your app's **`public/`** folder in order to make the referenced images available to display.

7. In order to organize the cards into a single group, you should implement another component **`PetList`** (making this a separate components helps keep your program organized, so you can reuse the card grid elsewhere if desired). This component will take a prop called **`pets`** (note the plural name!), which should be an _array_ of pet objects (similar to the `dogs.json` array). It should `.map()` that array to an array of `PetCard` components, and then render those elements. 

    - Note that you will need to pass in a pet object as prop to each `PetCard` as you instantiate it&mdash;luckily each card expects such a prop!

    - Again, copy-and-paste the "heading" for the card list from the mockup `index.html` file.

    Finally, modify the `App` component so that it renders the `PetList` at the appropriate place in the DOM hierarchy. You will need to `export` the `PetList` from `PetList.js` (as a _default_ export!), and then `import` it in `App.js` (as a _default_ import!). You do *not* need to export the `PetCard` component, since it is never referenced outside of its module (it's a "private helper" component!)

    Your app should now show all the page's content&mdash;you've converted the HTML/CSS into React!


8. The last part of the exercise is to make the page _interactive_. In particular, you will add the ability to click on a pet card to mark it as "adopted"&mdash;this will change the data stored in the model (the array of objects), and cause the page to "re-render" the associated card to also display `"(Adopted)"` after the pet's name.

    Because the pet data will now need to change over the life of the application, it should be stored in the [**state**](https://reactjs.org/docs/hooks-state.html) of the `App` Component, instead of just as an unchangeable prop. Use the _state hook_ (`useState()`) to specify a state variable (e.g., `pets`). The state value should be initialized to be the `props.pets` value, and you should modify the returned DOM so that it renders the current state value (instead of the initial props value).
    
9. Define a callback function (e.g., **`adoptPet()`**) inside the `App` component that takes in the _name_ of a pet (a String), and modifies the Object representing that pet in the `pets` state variable so that the pet's `adopted` property becomes `true`.

    - You'll need to create a new "copy" of the state variable array. You can do this by calling `.map()` on the array to create a new version. In this mapping, you should modify any pet object whose name is in the callback argument so that its `adopted` property is `true`. (Remember you can assign a value to a property even if that property was previously undefined! Also this is *not* a toggle--you can never "unadopt" a pet).

    - After you have the "updated array", you can call the state setter function to update the state variable, which will cause the component to be rerendered.

    Also modify the `PetCard` component so that _if_ the pet has been adopted, the text `(Adopted)` is shown next to the pet's name (with a space between). You can do this by creating a local variable for the `displayedName` (and using an if/else to set that), or by using an inline [ternary operator](https://reactjs.org/docs/conditional-rendering.html#inline-if-else-with-conditional-operator).

    (You can test this modification by _temporarily_ adding a `<button>` to the `App` that will call the method with a hard-coded pet name when clicked, or just proceed to the next step to complete the app).

10. The last step is to give each `PetCard` an `onClick` event handler which will (eventually) call the `adoptPet()` function you created in `App` as a callback. But in order for the `PetCard` to have access to this callback function, it will need to be given a reference to it as a _prop_. The `onClick` handler should be on the `.card` DOM element.

    Modify the `PetCard` component so that takes in a prop called **`adoptCallback`**. When the component's button is clicked, it should execute this callback function, passing it the name of the pet (which was also given it as a prop)!

    Since the `PetCard` component now needs an `adoptCallback` prop, that will need to be provided by the `PetList` component! But since that too will need to know what function to pass to the `<PetCard>`, you will **also** need to modify the `PetList` component so it takes an **`adoptCallback`** prop (which will then be passed down to the `PetCard`). You're passing a value (which happens to be a function) down the tree!

    Finally, you can have the `App` component pass in its `adoptPet` function to the `<PetList>` (which will then pass it down to to the `<PetCard>`).

With all this in place, you should be able to click on a `PetCard` to mark that pet as adopted (at least locally until the page reloads)!
