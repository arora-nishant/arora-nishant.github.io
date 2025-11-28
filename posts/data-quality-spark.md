Everyone knows the importance of knowledge and how critical it is to progress. In today’s world, data is knowledge. But that’s only when the data is “good” and correctly interpreted. Let’s focus on the “good” part. What do we really mean by “good data”?

Its definition can change from use case to use case but, in general terms, good data can be defined by its *accuracy, legitimacy, reliability, consistency, completeness, and availability*.

Bad data can lead to failures in production systems, unexpected outputs, and wrong inferences, leading to poor business decisions.

It’s important to have something in place that can tell us about the quality of the data we have, how close it is to our expectations, and whether we can rely on it.

This is basically the problem we’re trying to solve.

<br>
<br>

# The Problem and the Potential Solutions
A manual approach to data quality testing is definitely one of the solutions and can work well.

We’ll need to write code for computing various statistical measures, running them manually on different columns, maybe draw some plots, and then conduct some spot checks to see if there’s something not right or unexpected. The overall process can get tedious and time-consuming if we need to do it on a daily basis.

Certain tools can make life easier for us, like:

* [Amazon Deequ](https://github.com/awslabs/deequ)
* [Apache Griffin](https://griffin.apache.org/)
* [Great Expectations](https://greatexpectations.io/)
* [DBT](https://github.com/fishtown-analytics/dbt)

In this blog, we’ll be focussing on Amazon Deequ.

<br>
<br>

# Amazon Deequ
Amazon Deequ is an open-source tool developed and used at Amazon. It’s built on top of Apache Spark, so it’s great at handling big data. Deequ computes data quality metrics regularly, based on the checks and validations set, and generates relevant reports.

Deequ provides a lot of interesting features, and we’ll be discussing them in detail. Here’s a look at its main components:

![Deequ arch](/images/deequ-arch.png)

<br>
<br>

# Prerequisites
Working with Deequ requires having Apache Spark up and running with Deequ as one of the dependencies.

As of this blog, the latest version of Deequ, 1.1.0, supports Spark 2.2.x to 2.4.x and Spark 3.0.x.

For learning more about Deequ and its features, we’ll be using an open-source [IMDb dataset](https://datasets.imdbws.com/) which has the following schema: 

```python
root
 |-- tconst: string (nullable = true)
 |-- titleType: string (nullable = true)
 |-- primaryTitle: string (nullable = true)
 |-- originalTitle: string (nullable = true)
 |-- isAdult: integer (nullable = true)
 |-- startYear: string (nullable = true)
 |-- endYear: string (nullable = true)
 |-- runtimeMinutes: string (nullable = true)
 |-- genres: string (nullable = true)
 |-- averageRating: double (nullable = true)
 |-- numVotes: integer (nullable = true)
```

Here, *tconst* is the primary key, and the rest of the columns are pretty much self-explanatory.

<br>
<br>

# Data Analysis and Validation
Before we start defining checks on the data, if we want to compute some basic stats on the dataset, Deequ provides us with an easy way to do that. They’re called metrics.

Deequ provides support for the following [metrics](https://github.com/awslabs/deequ/tree/master/src/main/scala/com/amazon/deequ/analyzers):

```python
ApproxCountDistinct, ApproxQuantile, ApproxQuantiles, Completeness, Compliance, Correlation, CountDistinct, DataType, Distance, Distinctness, Entropy, Histogram, Maximum, MaxLength, Mean, Minimum, MinLength, MutualInformation, PatternMatch, Size, StandardDeviation, Sum, UniqueValueRatio, Uniqueness
```

Let’s go ahead and apply some metrics to our dataset.

```scala
val runAnalyzer: AnalyzerContext = { AnalysisRunner
  .onData(data)
  .addAnalyzer(Size())
  .addAnalyzer(Completeness("averageRating"))
  .addAnalyzer(Uniqueness("tconst"))
  .addAnalyzer(Mean("averageRating"))
  .addAnalyzer(StandardDeviation("averageRating"))
  .addAnalyzer(Compliance("top rating", "averageRating >= 7.0"))
  .addAnalyzer(Correlation("numVotes", "averageRating"))
  .addAnalyzer(Distinctness("tconst"))
  .addAnalyzer(Maximum("averageRating"))
  .addAnalyzer(Minimum("averageRating"))
  .run()
}

val metricsResult = successMetricsAsDataFrame(spark, runAnalyzer)
metricsResult.show(false)
```

We get the following output by running the code above:

```text
+-----------+----------------------+-----------------+--------------------+
|entity     |instance              |name             |value               |
+-----------+----------------------+-----------------+--------------------+
|Mutlicolumn|numVotes,averageRating|Correlation      |0.013454113877394851|
|Column     |tconst                |Uniqueness       |1.0                 |
|Column     |tconst                |Distinctness     |1.0                 |
|Dataset    |*                     |Size             |7339583.0           |
|Column     |averageRating         |Completeness     |0.14858528066240276 |
|Column     |averageRating         |Mean             |6.886130810579155   |
|Column     |averageRating         |StandardDeviation|1.3982924856469208  |
|Column     |averageRating         |Maximum          |10.0                |
|Column     |averageRating         |Minimum          |1.0                 |
|Column     |top rating            |Compliance       |0.080230443609671   |
+-----------+----------------------+-----------------+--------------------+
```


Let’s try to quickly understand what this tells us.

* The dataset has 7,339,583 rows.

* The distinctness and uniqueness of the tconst column is 1.0, which means that all the values in the column are distinct and unique, which should be expected as it’s the primary key column.

* The *averageRating* column has a min of 1 and a max of 10 with a mean of 6.88 and a standard deviation of 1.39, which tells us about the variation in the average rating values across the data.

* The completeness of the *averageRating* column is 0.148, which tells us that we have an average rating available for around 15% of the dataset’s records.

* Then, we tried to see if there’s any correlation between the *numVotes* and *averageRating* column. This metric calculates the Pearson correlation coefficient, which has a value of 0.01, meaning there’s no correlation between the two columns, which is expected.

This feature of Deequ can be really helpful if we want to quickly do some basic analysis on a dataset.

Let’s move on to defining and running tests and checks on the data.

<br>

### Data Validation

For writing tests for our dataset, we use Deequ’s VerificationSuite and add checks on attributes of the dataset.

Deequ has a big handy list of [validators](https://github.com/awslabs/deequ/blob/master/src/main/scala/com/amazon/deequ/checks/Check.scala) available to use, which are:

```text
hasSize, isComplete, hasCompleteness, isUnique, isPrimaryKey, hasUniqueness, hasDistinctness, hasUniqueValueRatio, hasNumberOfDistinctValues, hasHistogramValues, hasEntropy, hasMutualInformation, hasApproxQuantile, hasMinLength, hasMaxLength, hasMin, hasMax, hasMean, hasSum, hasStandardDeviation, hasApproxCountDistinct, hasCorrelation, satisfies, hasPattern, containsCreditCardNumber, containsEmail, containsURL, containsSocialSecurityNumber, hasDataType, isNonNegative, isPositive, isLessThan, isLessThanOrEqualTo, isGreaterThan, isGreaterThanOrEqualTo, isContainedIn
```

Let’s apply some checks to our dataset.

```scala
val validationResult: VerificationResult = { VerificationSuite()
  .onData(data)
  .addCheck(
    Check(CheckLevel.Error, "Review Check") 
      .hasSize(_ >= 100000) // check if the data has atleast 100k records
      .hasMin("averageRating", _ > 0.0) // min rating should not be less than 0
      .hasMax("averageRating", _ < 9.0) // max rating should not be greater than 9
      .containsURL("titleType") // verify that titleType column has URLs
      .isComplete("primaryTitle") // primaryTitle should never be NULL
      .isNonNegative("numVotes") // should not contain negative values
      .isPrimaryKey("tconst") // verify that tconst is the primary key column
      .hasDataType("isAdult", ConstrainableDataTypes.Integral) 
      //column contains Integer values only, expected as values this col has are 0 or 1
      )
  .run()
}

val results = checkResultsAsDataFrame(spark, validationResult)
results.select("constraint","constraint_status","constraint_message").show(false)
```

We have added some checks to our dataset, and the details about the check can be seen as comments in the above code.

We expect all checks to pass for our dataset except the *containsURL* and *hasMax* ones.

That’s because the *titleType* column doesn’t have URLs, and we know that the max rating is 10.0, but we are checking against 9.0.

We can see the output below:

```text
+--------------------------------------------------------------------------------------------+-----------------+-----------------------------------------------------+
|constraint                                                                                  |constraint_status|constraint_message                                   |
+--------------------------------------------------------------------------------------------+-----------------+-----------------------------------------------------+
|SizeConstraint(Size(None))                                                                  |Success          |                                                     |
|MinimumConstraint(Minimum(averageRating,None))                                              |Success          |                                                     |
|MaximumConstraint(Maximum(averageRating,None))                                              |Failure          |Value: 10.0 does not meet the constraint requirement!|
|containsURL(titleType)                                                                      |Failure          |Value: 0.0 does not meet the constraint requirement! |
|CompletenessConstraint(Completeness(primaryTitle,None))                                     |Success          |                                                     |
|ComplianceConstraint(Compliance(numVotes is non-negative,COALESCE(numVotes, 0.0) >= 0,None))|Success          |                                                     |
|UniquenessConstraint(Uniqueness(List(tconst),None))                                         |Success          |                                                     |
|AnalysisBasedConstraint(DataType(isAdult,None),<function1>,Some(<function1>),None)          |Success          |                                                     |
+--------------------------------------------------------------------------------------------+-----------------+-----------------------------------------------------+
```

In order to perform these checks, behind the scenes, Deequ calculated metrics that we saw in the previous section.

To look at the metrics Deequ computed for the checks we defined, we can use: 

```scala
VerificationResult.successMetricsAsDataFrame(spark,validationResult)
                  .show(truncate=false)
```

<br>
<br>

# Automated Constraint Suggestion
Automated constraint suggestion is a really interesting and useful feature provided by Deequ.

Adding validation checks on a dataset with hundreds of columns or on a large number of datasets can be challenging. With this feature, Deequ tries to make our task easier. Deequ analyses the data distribution and, based on that, suggests potential useful constraints that can be used as validation checks.

Let’s see how this works.

This piece of code can automatically generate constraint suggestions for us:

```scala
val constraintResult = { ConstraintSuggestionRunner()
  .onData(data)
  .addConstraintRules(Rules.DEFAULT)
  .run()
}

val suggestionsDF = constraintResult.constraintSuggestions.flatMap { 
  case (column, suggestions) => 
    suggestions.map { constraint =>
      (column, constraint.description, constraint.codeForConstraint)
    } 
}.toSeq.toDS()

suggestionsDF.select("_1","_2").show(false)
```

Let’s look at constraint suggestions generated by Deequ:

```text
+--------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|runtimeMinutes|'runtimeMinutes' has less than 72% missing values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|tconst        |'tconst' is not null                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|titleType     |'titleType' is not null                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|titleType     |'titleType' has value range 'tvEpisode', 'short', 'movie', 'video', 'tvSeries', 'tvMovie', 'tvMiniSeries', 'tvSpecial', 'videoGame', 'tvShort'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|titleType     |'titleType' has value range 'tvEpisode', 'short', 'movie' for at least 90.0% of values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|averageRating |'averageRating' has no negative values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|originalTitle |'originalTitle' is not null                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|startYear     |'startYear' has less than 9% missing values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|startYear     |'startYear' has type Integral                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|startYear     |'startYear' has no negative values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|endYear       |'endYear' has type Integral  
|endYear       |'endYear' has value range '2017', '2018', '2019', '2016', '2015', '2020', '2014', '2013', '2012', '2011', '2010',......|
|endYear       |'endYear' has value range '' for at least 99.0% of values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|endYear       |'endYear' has no negative values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|numVotes      |'numVotes' has no negative values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|primaryTitle  |'primaryTitle' is not null                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|isAdult       |'isAdult' is not null                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|isAdult       |'isAdult' has no negative values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|genres        |'genres' has less than 7% missing values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
+--------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

We shouldn’t expect the constraint suggestions generated by Deequ to always make sense. They should always be verified before using.

This is because the algorithm that generates the constraint suggestions just works on the data distribution and isn’t exactly “intelligent.”

We can see that most of the suggestions generated make sense even though they might be really trivial.

For the endYear column, one of the suggestions is that endYear should be contained in a list of years, which indeed is true for our dataset. However, it can’t be generalized as every passing year, the value for endYear continues to increase.

But on the other hand, the suggestion that titleType can take the following values: 'tvEpisode,' 'short,' 'movie,' 'video,' 'tvSeries,' 'tvMovie,' 'tvMiniSeries,' 'tvSpecial,' 'videoGame,' and 'tvShort' makes sense and can be generalized, which makes it a great suggestion.

And this is why we should not blindly use the constraints suggested by Deequ and always cross-check them.

Something we can do to improve the constraint suggestions is to use the useTrainTestSplitWithTestsetRatio method in ConstraintSuggestionRunner.
It makes a lot of sense to use this on large datasets.

How does this work? If we use the config useTrainTestSplitWithTestsetRatio(0.1), Deequ would compute constraint suggestions on 90% of the data and evaluate the suggested constraints on the remaining 10%, which would improve the quality of the suggested constraints.

<br>
<br>

# Anomaly Detection
Deequ also supports anomaly detection for data quality metrics.

The idea behind Deequ's anomaly detection is that often we have a sense of how much change in certain metrics of our data can be expected. Say we are getting new data every day, and we know that the number of records we get on a daily basis are around 8 to 12k. On a random day, if we get 40k records, we know something went wrong with the data ingestion job or some other job didn’t go right.

Deequ will regularly store the metrics of our data in a MetricsRepository. Once that’s done, anomaly detection checks can be run. These compare the current values of the metrics to the historical values stored in the MetricsRepository, and that helps Deequ to detect anomalous changes that are a red flag.

One of Deequ’s anomaly detection strategies is the *RateOfChangeStrategy*, which limits the maximum change in the metrics by some numerical factor that can be passed as a parameter.

Deequ supports other strategies that can be found [here](https://github.com/awslabs/deequ/blob/master/src/main/scala/com/amazon/deequ/examples/AnomalyDetectionExample.scala). And code examples for anomaly detection can be found [here](https://github.com/awslabs/deequ/blob/master/src/main/scala/com/amazon/deequ/examples/AnomalyDetectionExample.scala).

<br>
<br>

# Conclusion
We learned about the main features and capabilities of AWS Lab’s Deequ.

It might feel a little daunting to people unfamiliar with Scala or Spark, but using Deequ is very easy and straightforward. Someone with a basic understanding of Scala or Spark should be able to work with Deequ’s primary features without any friction.

For someone who rarely deals with data quality checks, manual test runs might be a good enough option. However, for someone dealing with new datasets frequently, as in multiple times in a day or a week, using a tool like Deequ to perform automated data quality testing makes a lot of sense in terms of time and effort.

We hope this article helped you get a deep dive into data quality testing and using Deequ for these types of engineering practices.
