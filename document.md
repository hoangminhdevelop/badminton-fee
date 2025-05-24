# Badminton Match & Fee Management System
**Business Requirements & Feature Specifications**

## Project Overview
A comprehensive web application for managing badminton matches and calculating shared fees among players. The system tracks matches, manages players, and automates fee calculations based on court rental costs and shuttlecock usage.

## Business Context
- **Purpose**: Automate fee splitting after badminton sessions
- **Target Users**: Badminton groups, clubs, and casual players
- **Use Case**: Players want to fairly distribute costs (court rent + shuttlecocks) based on participation and match results

## Core Business Rules

### Currency & Units
- **Currency**: Vietnamese Dong (VND)
- **Minimum Amount**: 1,000 VND
- **Duration**: Minutes
- **Rounding**: All final totals rounded UP to nearest 1,000 VND

### Fee Calculation Logic
#### Match Fees (Court Rental)
- **Formula**: (Hourly Rent × Duration in Hours) ÷ Total Players in Match
- **Distribution**: Split equally among ALL players in the match
- **Example**: 120,000 VND/hour × 1.5 hours ÷ 4 players = 45,000 VND per player

#### Shuttlecock Fees
- **Formula**: (Shuttlecock Price × Count Used) ÷ Losing Team Size
- **Distribution**: Only LOSING team pays for shuttlecocks
- **Example**: 30,000 VND/shuttlecock × 2 shuttlecocks ÷ 2 losing players = 30,000 VND per losing player

#### Total Player Fee
- Sum of all match fees + shuttlecock fees from matches played
- Final amount rounded UP to nearest 1,000 VND

## Detailed Feature Requirements

### 1. Cost Settings Management
#### Business Requirements
- Must be configured before creating any matches
- Settings persist across sessions
- Validation ensures realistic pricing

#### Functional Requirements
- **Court Rent Input**: Hourly rate in VND (minimum 1,000)
- **Shuttlecock Price Input**: Per shuttlecock cost in VND (minimum 1,000)
- **Validation**: Both fields required, numeric only, minimum 1,000 VND
- **Storage**: Persist in localStorage as `badminton_costs`
- **UI**: Form with save button, success feedback

#### User Stories
- As a session organizer, I want to set court rental rates so fees can be calculated accurately
- As a user, I want to update shuttlecock prices to reflect current market rates

### 2. Player Management
#### Business Requirements
- Support unlimited players
- Each player has unique identity
- Players can be added/removed dynamically

#### Functional Requirements
- **Add Player**: Text input + Add button OR Enter key
- **Remove Player**: Click X button on player tag
- **Storage**: localStorage as `badminton_players` with UUID
- **Validation**: Non-empty names, no duplicates
- **Display**: Player tags with name and remove button

#### User Stories
- As a session organizer, I want to quickly add new players to the system
- As a user, I want to remove players who won't participate today

### 3. Match Creation & Management
#### Business Requirements
- Track match details for accurate fee calculation
- Support singles (1v1) and doubles (2v2) formats
- Record winners for shuttlecock fee distribution

#### Functional Requirements
##### Team Selection
- **Team 1 & Team 2**: 1-2 players each via dropdown
- **Validation**: 
  - Minimum 1 player per team
  - No player on both teams
  - All selected players must exist
- **Display**: Selected players as removable tags

##### Match Details
- **Duration**: Minutes (required, > 0)
- **Shuttlecocks Used**: Count (required, > 0) 
- **Winner**: Team 1 or Team 2 (required)

##### CRUD Operations
- **Create**: Modal form with validation
- **Read**: Display matches as cards with all details
- **Update**: Click match card to edit in same modal
- **Delete**: X button with confirmation

#### User Stories
- As a player, I want to record match results so fees are calculated correctly
- As a session organizer, I want to edit incorrect match data
- As a user, I want to see all matches played in a session

### 4. Fee Calculation & Display
#### Business Requirements
- Automatic calculation based on match participation
- Transparent breakdown for each player
- Real-time updates when matches change

#### Functional Requirements
##### Player Statistics
- **Matches Played**: Count of matches participated
- **Wins**: Count of matches won
- **Total Fee**: Sum of all match + shuttlecock fees

##### Display Requirements
- **Desktop**: Responsive table with columns
- **Mobile**: Card layout for each player
- **Summary**: Total fees across all players
- **Empty State**: Message when no cost settings configured

##### Calculation Rules
1. For each match a player participated:
   - Add match fee (rent share)
   - If on losing team: add shuttlecock fee share
2. Round final total UP to nearest 1,000 VND

#### User Stories
- As a player, I want to see exactly how much I owe and why
- As a session organizer, I want to verify total costs match expected amounts
- As a user, I want calculations to update automatically when matches change

### 5. Data Management
#### Business Requirements
- Persist data across browser sessions
- Allow complete reset for new sessions
- Prevent accidental data loss

#### Functional Requirements
- **Storage**: localStorage with structured keys
- **Reset**: Confirmation dialog before clearing all data
- **Backup**: Data survives browser refresh
- **Keys**:
  - `badminton_players`: Player array
  - `badminton_matches`: Match array  
  - `badminton_costs`: Cost settings object

#### User Stories
- As a session organizer, I want to reset all data to start fresh
- As a user, I want my data saved automatically

## User Interface Requirements

### Layout & Navigation
- **Single Page Application**: No page routing needed
- **Responsive Design**: Mobile-first approach
- **Grid Layout**: Sidebar (settings/players) + main area (matches/fees)
- **Progressive Disclosure**: Forms appear in modals

### Visual Design
- **Modern**: Clean, card-based layout
- **Professional**: Suitable for sports/business use
- **Accessible**: Clear labels, good contrast
- **Branded**: Consistent color scheme throughout

### User Experience
- **Intuitive**: Common patterns (forms, tables, modals)
- **Efficient**: Keyboard shortcuts (Enter to submit)
- **Forgiving**: Confirmation dialogs for destructive actions
- **Responsive**: Immediate feedback for user actions

## Success Criteria

### Functional Success
- [ ] Users can configure cost settings before creating matches
- [ ] Players can be added/removed dynamically
- [ ] Matches can be created with proper team selection and validation
- [ ] Fee calculations are accurate according to business rules
- [ ] Data persists across browser sessions
- [ ] All features work on mobile and desktop

### User Experience Success
- [ ] New users can understand the workflow without training
- [ ] Fee calculations are transparent and verifiable
- [ ] Common tasks (add player, create match) are quick and easy
- [ ] System provides helpful feedback and error messages

### Technical Success
- [ ] No data loss during normal usage
- [ ] Performance remains good with reasonable amounts of data
- [ ] Application works in modern browsers
- [ ] Code is maintainable and well-structured

## Business Process Flow

1. **Session Setup**
   - Configure court rent and shuttlecock prices
   - Add all participating players

2. **Match Recording**
   - Create matches as they're played
   - Record teams, duration, shuttlecocks used, winner

3. **Fee Calculation**
   - Review fee breakdown for each player
   - Verify totals match expected costs

4. **Session End**
   - Collect fees from players
   - Optionally reset for next session

## Edge Cases & Business Logic

### Player Scenarios
- **Single Player Multiple Matches**: Fees accumulate correctly
- **Player Removal**: Cannot remove if player is in existing matches
- **Duplicate Names**: System prevents confusion

### Match Scenarios
- **Unequal Teams**: 1v2 matches supported with fair fee distribution
- **Zero Shuttlecocks**: Allowed (practice matches)
- **Long Matches**: No upper limit on duration

### Calculation Scenarios
- **Rounding**: Always benefits the house (rounds up)
- **Empty Matches**: No matches = zero fees
- **Missing Cost Settings**: Graceful handling with user guidance
