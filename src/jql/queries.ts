//
// JQL ORM-lite Query Stash
// TODO: Make this more query-builder-like
//
let project: string = ''

const assignedToCurrentUser = 'assignee=currentUser()'
const isOpen = 'resolution=Unresolved'
const inProject = `project="${project}"`
const inOpenSprint = 'sprint in openSprints()'

const orderBy = ' ORDER BY key '

export {
    assignedToCurrentUser,
    isOpen,
    inProject,
    inOpenSprint,
    orderBy
}

