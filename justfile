# List all notes
list:
  @ls ./src/data/notes/

# Publish notes
pub:
  @./update.sh

# Create new note with name
new name:
  npm run new -- {{name}}


