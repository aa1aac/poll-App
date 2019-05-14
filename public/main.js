const form = document.getElementById("vote-form");

form.addEventListener("submit", e => {
  e.preventDefault();
  const choice = document.querySelector("input[name=os]:checked").value;
  const data = { os: choice };
  fetch("http://localhost:3000/poll", {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
});

fetch("http://localhost:3000/poll")
  .then(res => res.json())
  .then(data => {
    let votes = data.votes;
    let totalVotes = votes.length;

    let voteCounts = {
      windows: 0,
      macos: 0,
      linux: 0,
      other: 0
    };

    voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
      ),
      {}
    );

    let dataPoints = [
      { label: "windows", y: voteCounts.windows },
      { label: "macos", y: voteCounts.macos },
      { label: "linux", y: voteCounts.linux },
      { label: "other", y: voteCounts.other }
    ];

    const chartContainer = document.querySelector("#chartContainer");

    if (chartContainer) {
      const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light1",
        title: { text: `OS Votes     Totalvotes:${totalVotes}` },
        data: [
          {
            type: "column",
            dataPoints: dataPoints
          }
        ]
      });
      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      var pusher = new Pusher("02aa8af22271ca295d51", {
        cluster: "ap2",
        forceTLS: true
      });

      var channel = pusher.subscribe("os-poll");
      channel.bind("os-vote", function(data) {
        dataPoints = dataPoints.map(d => {
          if (d.label == data.os) {
            d.y += data.points;
            return d;
          } else {
            return d;
          }
        });
        chart.render();
      });
    }
  });
