if (parseInt(process.version.match(/v?(.)/)[1], 10) < 6) {
  console.log('Please upgrade your node runtime. Only node > v6 is supported');
  process.exit(1);
}
