// doc
# Badminton match and fee management web application
   - This app is using to create match and player, that created purpose is sharing the fee after finish play period

## App features

## Units
   - Currency: VND with min is 1.000VND
   - Match time duration: minute


### Enter fixed cost
   - We will enter them before create any match
   - Cost variables: 
      + Price for rent stage
      + Price for per shuttlecock

### Create Player
   - Have a text input and `Add` button
   - This field will submit when i click on `Add` button or enter key
   - Those player will be storage in localstorage with unique id and name
   - Each player will display in a tag with name and `x` button

### Remove employee
   - When i click on `x` button, that player will be removed from the list

### Create a match
   - Have a `Create new match` button, when i click on it, that will trigger to appear a form to create a new match.
   - In this form we will have bellow fields:
      + Team 1 and Team 2
         . In each team we can select 1 or 2 player
         . Select team player must be a select box, after select, the selected player will be appear in a tag.
         . If the players are selected for team 1, we can't select them for team 2
      + shuttlecock number are used: number, and > 0
      + The match duration: minutes
      + Team win: team 1 or team 2
   
   - We will have a `Save` button at the button. When i click on it the match will be save to the localstorage with unique id and match information

   - After the match created, it will be appear on screen in the card and creation form will be hidden That card will save `x` button, when i click on it, it will be removed in the storage


### Update a match
   - When i click on match card, The form update will be appear on screen and fill default all field by the match info
   - After update i can click on `Update match` button to save then the match info will bw updated and the form update will be hidden

### Calculation fee


   - Have a `calculate` button, when i click on it will calculate fee with bellow rule:

   - Each match
      +  Shuttlecock fee: Team lose will pay for shuttlecock fee share for all team lose player
      + Match fee: calculate via match duration and Price for rent stage from cost variable, share for all player in this match

   - Total fee: total the fee for each employee from all match their join

   - The fee will round up

   - Create a table to show fee for each player, the table will how name, match number their join

   ### reset all
      - When i click on reset all button, this app will reset all info