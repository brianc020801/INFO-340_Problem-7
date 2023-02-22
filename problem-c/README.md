# Problem: Data Filtering (FIFA)

In this exercise you will practice developing a state-based React application that allows the user to dynamically search and filter data (specifically, data on [FIFA World Cup Finals](https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_finals) matches)

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
To complete the exercise, edit the included files in **`src/component/`** and add in the required code. Note that you should ___NOT___ edit any of the other provided files (including `index.js` or `index.html`).

The provided starter code will render components to display the game data, as well as forms used to filter this data. You will be adding code to provide _interactivity_ (i.e., making the forms actually do something)!

1. First, modify the **`src/component/GameDataTable.js`** file to enable the columns of the data table to be sorted. 

    1. Use the **`useState()`** function to give the `GameDataTable` component a single **state variable** (e.g., `sortByCriteria`) to keep track of _which_ column the data is being sorted by. This state variable should have an initial value of e.g., `null` to indicate that no column is selected at the start.

    2. Inside the `GameDataTable` component, define a callback function (e.g., `handleClick`) that can be called whenever one of the SortButtons are clicked. As a click callback, this function will be passed an `event` argument representing the click event that occurred. You will also need to specify your click handler callback as the `onClick` prop for _each_ of the 4 buttons button in the table.
    
        You can get _which_ button was clicked by accessing the `event.currentTarget.name` value (the `name` property of the `currentTarget`&mdash;the clickable element&mdash;of the `event`). Note that this `name` value is also the name of the data table's property. When a button is clicked, you should save that value in the `sortByCriteria` state variable (use the state setter function created by your `useState()` call).

    3. Updating the state variable will cause the component to be "re-rendered". Modify the `GameDataTable` component so that when it is rendered, before it maps the data into `<GameDataRow>` elements, it **sorts** the data by the `sortByCriteria` value that is stored in the state.

        The easiest way to do this is to use the Lodash [`.sortBy()`](https://lodash.com/docs/4.17.15#sortBy) function, passing in the array to sort (the `data` prop) and the property to sort by (e.g., the `sortByCriteria`). This function will return a new sorted array; it is that array that should be mapped into `<GameDataRow>` elements.

        Once you've completed this step, you should be able to click on the sort buttons in order to sort by each column!

    4. In order to clearly indicate to the user which column is being sorted, modify each 4 of the `<SortButton>` elements so that they have the **`active`** prop with a value of `true` if the current `sortByCriteria` matches their `name` string, and false otherwise. It is acceptable to hard-code in this string (as e.g., `"year"`). This should make the buttons highlight in blue when the column is sorted.
    
2. At this point the "sort" icons doesn't reflect the sort order&mdash;the icon is for descending order, but the data is sorted in ascending order (smallest value first). Moreover, it would be nice to be able to "reverse-sort" columns to easily see the high score for example. To fix this, add the ability to also sort columns in **reverse order**. Clicking a column button once will sort that column in ascending order, clicking it a second time will sort it in descending order, and clickig it a third time will go back to the unsorted order (this is the same behavior as RStudio's `View()` interface).

    1. To do this, give the `GameDataTable` a _second_ state variable (e.g., `isAscending`) to keep track of whether the current sorting is ascending or descending. This state variable will be a boolean to show whether something is in 1 of 2 mutually exclusive states; a value of `null` can represent "neither" (and should be the initial value for the state variable).

    2. Modify the click handler callback function so that it uses the following logic:
        - If the clicked button's name is **not** the current `sortByCriteria`, set the state to sort by that button's name in ascending order.
        - Otherwise, if the order is currently ascending, change it to not ascending (to reverse the order). But if the order is not currently ascending, then stop sorting all together (set the sort criteria and ascending state to both be `null`). Note that there are 3 conditions here; I used a nested if statement.

        (Notice how in this example you use multiple state variable together, and can change multiple state variables in response to events&mdash;multiple state setter calls will be "batched" together).

    3. When rendering the component, _after_ you sort the `data` prop, if the sort criteria is specified **and** the sort order is **not** ascending, reverse the order of the sorted data. You can do this using Lodash's [`.reverse()`](https://lodash.com/docs/4.17.15#reverse) function.

    4. Finally, modify each of the 4 `<SortButton>` elements so that they have the **`ascending`** prop with a value of `true` if the current `sortByCriteria` matches their `name` string **and** the sort order is ascending. This should make the buttons highlight in blue and be facing the correct "direction" matching the sorting order.

3. Next you'll set up the filter form to let the user to filter for specific teams. The first step of this is to make the **`TeamSelectForm`** (in the `src/components/TeamSelectForm.js` file) into a [**controlled form**](https://reactjs.org/docs/forms.html#controlled-components).

    1. Create state variables (two of them!) to track the values of the team selected from the `<select>` input (default value is an empty string `''`), and if runner-ups should be included because of the `checkbox` input (default value is `false`, not selected).

    2. Modify the rendered DOM so that the `<select>` element's `value` is the selected team state variable, and the `<input type="checkbox">` element's `checked` property (not the `value`!) is whether runner-ups are included. Note that this will cause the inputs to temporarily "stop working".

    3. Inside of the `TeamSelectForm` Component, define two callback functions to handle changes to the `<select>` and `<input>` elements respectively. As a change callback, each function will be passed an `event` argument representing the change event that occurred. You can access the value selected by the `<select>` element as `event.target.value`, and whether the checkbox is checked as `event.target.checked` (within the respective functions of course). When an element is changed, update the appropriate state variable to store the new value/checked. You will also need to add the appropriate callback function as the `onChange` prop for each of the two inputs. This will cause the inputs to "work" again, with their value now stored in the Component's state! 

    4. Finally, define a click event handler callback that will be called whenever the form's `<button>` element is clicked. You will fill in the behavior of this callback in the next step.

4. The last step is to allow the data table to be filtered based on the input from the form. But because `<GameDataTable>` and `<TeamSelectForm>` are siblings, the state data that controls the current filtering will need go in their mutual parent: the **`App`** component (found in `src/components/App.js`).

    1. Add state to the `App` component that will store the filtering criteria (e.g., the team name and whether runner up is selected). You can either store an object with multiple values in a single state variable, or use multiple state variables (multiple variables is slightly more idiomatic).

    2. Notice that the `App` component has a `gameData` prop containing all of the game data; the prop is passed down directly to the `<GameDataTable>` element for rendering, and is used to determine the set of teams rendered as options by the `<TeamSelectForm>`.
    
        In the `App` component (before you `return` the DOM), use the `filter()` function to filter the `gameData` prop based on the filter criteria stored in the state. Remember to save the filtered data as a new variable (e.g., `displayedData`). Your filter should be based on the following logic:
            - If the filter criteria's team name is an empty string (`''`), then no team was select to filter: the displayed data should be the full data set stored in the `gameData` prop.
            - Otherwise, any game object whose `winner` property is the team name should pass the filter; and if runners-up are included, then any game object whose `runner_up` property is the team name should pass the filter as well. All other games should be excluded.

        In the `App` component's rendered DOM, modify the rendered `<GameDataTable>` so that it's passed the `displayedData` as it's `data` prop, rather than the full data set. You can test that this all works by modifying the initial values of your state variable(s).

    3. In the `App` component, define a callback function called e.g., `applyFilter()`. This function should expect two arguments: a team name to filter for (a string), and whether to include runners-up (a boolean). When this function is called, it should update the state variable(s) in the `App`. (It's good practice to define a separate function to manage this as a wrapper around the state setter. It provide _information hiding_ and enables the component to have a more stable public API).
    
    4. In the `App` component's rendered DOM, Modify the rendered `<TeamSelectForm>` so that it is passed the `applyFilter` callback function as a prop (you could call it e.g., `applyFilterCallback`). 
    
        Then in the `TeamSelectForm` component, modify the button's click handler callback so that it calls the passed down function (e.g., the `prop.applyFilterCallback()` function), passing it the form's state variables. Because this the `App`'s function and modifies the `App`'s state, it will cause the whole `App` to be rerendered with new filtering criteria, which will then apply to that rendering so that only the filtered data will be passed into the `<GameDataTable>` to be displayed. This should enable form-based filtering!

    (From a usability perspective it may be nicer if the `<select>` and checkbox inputs directly led to the table being filtered without requiring a separate button click, but having the button forces more explicit and clear usage for state for you to practice with!)
