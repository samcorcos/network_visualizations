Network
=====

Website for network visuals

- Add custom, Materialize login buttons
- Create D3 data visualization for the network
  - Force directed graph with D3
  - THREE.js 3D network visualization
- Create the about page from information on the current website
- Center navbar elements, right-align login buttons


##Network

- Names should appear on hover-over
- ~~Should be sticky~~
- Links people by "friends"
- Filter with a search function


##Grouped

- Groups by category, which should be selectable by a number of buttons on the top of the page.
- Group by:
  1. Occupation
  2. Location
  3. Male/Female
  4. Marital Status
- Colors should change based on the chosen category

##Map

- Based on: http://bl.ocks.org/NPashaP/a74faf20b492ad377312
- Shows concentration of people in various states
- Colors should be darker for denser states
- Hover-over should show some data (perhaps names of individuals?)
- State onclick should bring the user to a separate page (or modal) that displays all the people present in the state and some details about them
- Get state path data out of the states.js(json) file and separate logic from static data
- Layer svgs on the states to give them depth as well as color
- Map should filter based on certain criteria... Probably not generic search. Dropdown?
