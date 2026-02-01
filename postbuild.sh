#!/bin/bash

# public domain file

# Define the source directory (current directory by default)
dir="${1:-.}"

# Loop through files matching pattern *.cul.*.js
for file in "$dir"/*.cul.*.js; do
    # Extract the base name without the hash part
    new_file="${file%.*.*}.js"
    
    # Copy the file with the new name
    cp "$file" "$new_file"
    
    echo "Copied $file -> $new_file"

    # use find command to make a manifest of src/.observablehq/cache
    find src/.observablehq/cache -type f > src/.observablehq/manifest.txt
done
