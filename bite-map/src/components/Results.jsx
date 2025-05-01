import ResultItem from "./ResultItem.jsx";

export default function Results() {
  return (
    <div className="results-container">
      <h2>Results</h2>
      <ul>
        <ResultItem />
        <ResultItem />
      </ul>
    </div>
  );
}
