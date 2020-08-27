'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.replace(/\s*$/, '')
        .split('\n')
        .map(str => str.replace(/\s*$/, ''));

    main();
});

function readLine() {
    return inputString[currentLine++];
}

// Complete the twoPluses function below.
function twoPluses(grid) {
    let plusses = [];
    let maxProduct = 0;
    let singleCount = 0;

    // confirm that there are at least 2 good spaces.
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i].charAt(j) === "G") singleCount++;
        }
    }

    // return 0 if there are not at least 2 good spaces (probably does not happen).
    if (singleCount < 2) return 0;

    // return 1 if the grid is not big enough for a plus larger than 1.
    if (grid.length < 3 || grid[0].length < 3 || singleCount < 6) return 1;

    for (let row = 1; row < grid.length - 1; row++) {
        for (let column = 1; column < grid[0].length - 1; column++) {            
            
            // find size of plus.
            if (grid[row].charAt(column) === "G") {
                let plusSize = 1;

                // establish shortest distance to an edge.
                let distanceRight = (grid[0].length - 1) - column;
                let distanceDown = (grid.length - 1) - row;
                let distanceToEdge = column;
                if (row < distanceToEdge) distanceToEdge = row;
                if (distanceRight < distanceToEdge) distanceToEdge = distanceRight;
                if (distanceDown < distanceToEdge) distanceToEdge = distanceDown;

                // count plus size from center.
                for (let i = 1; i <= distanceToEdge; i++) {
                    if (grid[row - i].charAt(column) === "G"
                    && grid[row + i].charAt(column) === "G"
                    && grid[row].charAt(column - i) === "G"
                    && grid[row].charAt(column + i) === "G") {
                        plusSize += 2;
                    } else {
                        break;
                    }
                }

                // add all dimensional plusses to list (anything bigger than one space).
                if (plusSize > 1) {
                    plusses.push([row, column, plusSize]);
                }
            }
        }
    }

    // for test purposes only:
    // return plusses;

    // only one plus? reduce size if necessary to make another plus.
    if (plusses.length === 1) {
        if ((plusses[0][2] * 2) - 1 < singleCount) {
            return (plusses[0][2] * 2) - 1; 
        } else {
            return (plusses[0][2] * 2) - 4;
        }
    }

    // no dimensional plusses? there must be single spaces that technically count.
    if (plusses.length === 0) return 1;

    // cycle through the list of plusses & compare each to every other plus.
    for (let i = 1; i < plusses.length; i++) {
        
        // create list of coordinates in plus to test other plusses against.
        let firstCoords = [];
        firstCoords.push([plusses[i][0], plusses[i][1]]);
        let firstActiveSize = 1;

        // test all possible sizes of current plus from smallest to largest.
        for (let expanding = 1; expanding <= (plusses[i][2] - 1) / 2; expanding++) {
            firstCoords.push([plusses[i][0] + expanding, plusses[i][1]]);
            firstCoords.push([plusses[i][0] - expanding, plusses[i][1]]);
            firstCoords.push([plusses[i][0], plusses[i][1] + expanding]);
            firstCoords.push([plusses[i][0], plusses[i][1] - expanding]);
            firstActiveSize += 2;

            // test all other plusses for intersections & reduce size if necessary.
            for (let j = 0; j < plusses.length; j++) {
                if (i === j) continue;
                let plussesIntersect = false;
                let secondActiveSize = plusses[j][2];
            
                for (let k = 0; k <= (plusses[j][2] - 1) / 2; k++) {
                    let r = plusses[j][0];
                    let c = plusses[j][1];
                    for (let n = 0; n < firstCoords.length; n++) {
                        if ((r + k === firstCoords[n][0] && c === firstCoords[n][1])
                        || (r - k === firstCoords[n][0] && c === firstCoords[n][1])
                        || (r === firstCoords[n][0] && c + k === firstCoords[n][1])
                        || (r === firstCoords[n][0] && c - k === firstCoords[n][1])) {
                            secondActiveSize = ((k - 1) * 2) + 1;
                            if (secondActiveSize < 1) secondActiveSize = 1;
                            plussesIntersect = true;
                            break;
                        }
                    }
                    if (plussesIntersect) break;
                }
            
                // calculate maximum product of the two plusses being compared.
                let product = ((secondActiveSize * 2) - 1) * ((firstActiveSize * 2) - 1);
                if (product > maxProduct) maxProduct = product;
            }
        }
    }

    return maxProduct;
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const nm = readLine().split(' ');

    const n = parseInt(nm[0], 10);

    const m = parseInt(nm[1], 10);

    let grid = [];

    for (let i = 0; i < n; i++) {
        const gridItem = readLine();
        grid.push(gridItem);
    }

    let result = twoPluses(grid);

    ws.write(result + "\n");

    ws.end();
}
