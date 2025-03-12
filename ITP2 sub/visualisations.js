// visualisations.js
// Container for all visualizations in the application.

function Visualisations() {
  this.visuals = [];
  this.selectedVisual = null;

  // Add a new visualization object to the array
  this.add = function(vis) {
    this.visuals.push(vis);
    // If no visual is currently selected, select the newly added one
    if (this.selectedVisual === null) {
      this.selectVisual(vis.name);
    }
  };

  // Select a visualization by its name property
  this.selectVisual = function(visName) {
    for (let i = 0; i < this.visuals.length; i++) {
      if (visName === this.visuals[i].name) {
        this.selectedVisual = this.visuals[i];
      }
    }
  };
}
