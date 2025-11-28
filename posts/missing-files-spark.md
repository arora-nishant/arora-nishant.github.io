Encountering *Path does not exist* error in Spark while reading files is quite common. But there could be use cases where you want to just ignore the missing paths, especially when reading from multiple paths in one go. I was working on a similar use case recently where I was reading data from multiple S3 paths into a single dataframe but for this use case, it was quite possible that some of the paths I am trying to read might not exist at that point in time. So I was looking for a good and elegant way to handle this.

First of all, let’s quickly see how we can read a single existing file from S3 using Spark. We’ll need to specify some configurations and package dependencies to do that. I’m using PySpark 3.1.2 so the configs below are expected to work for Spark3 but can be tweaked to work for Spark2 as well.

```python
c = SparkConf()
 
c.set("spark.hadoop.fs.s3a.access.key","enter_access_key")
c.set("spark.hadoop.fs.s3a.secret.key","enter_secret_key")
c.set("spark.hadoop.fs.s3a.impl","org.apache.hadoop.fs.s3a.S3AFileSystem")
c.set('spark.jars.packages','com.amazonaws:aws-java-sdk:1.11.271,org.apache.hadoop:hadoop-aws:3.1.2')
 
spark = SparkSession.builder.config(conf=c).getOrCreate()
```

Now we have our spark session ready and to read a parquet file for example from S3, we can simply use:

```python
spark.read.parquet("s3a://bucket_name/path_to_parquet_file")
```

Now coming back to our problem where we are giving spark a list of S3 paths to be read, some of which might not exist. Here we want Spark to read all the paths in the list that exist, ignore the missing paths, and not throw any error.

The first solution which makes sense is to loop over all the paths in the list, read each of them in try-except blocks to avoid path does not exist errors, and union all the individual dataframes. This will work but it’s not too elegant. The code for this approach will look something like this :

```python
data = None
for path in list_of_paths:
    try:
        df = spark.read.parquet(path)         
    except:
        df = None
     
    if df:
        if data:
            data = data.union(df)
        else:
            data = df
```

In search of a better solution, I came across the *ignoreMissingFiles* config in Spark documentation and I seeing the name of the config, I thought this is it! It will do the job. But after reading about it, realized that this is something else and won’t solve the problem. For this config, a missing file actually means a deleted file under the directory after the dataframe has been constructed. When set to true, the Spark jobs will continue to run when encountering missing files and the contents that have been read will still be returned.

Moving on, I decided to write a small functionality to check for paths that don’t exist in the list and filter them out before handing them over to Spark for reading. For this, I used the exists method for a hadoop filesystem. We are using S3 so we need to create S3 FileSystem object first and then use the exists method.

The code for this will look something like this:

```python
sc = spark.sparkContext
uri = sc._jvm.java.net.URI.create("s3://bucket-name/")
s3FS = sc._jvm.org.apache.hadoop.fs.FileSystem.get(uri, sc._jsc.hadoopConfiguration())
 
existing_paths = [path for path in list_of_paths if s3FS.exists(path)]
 
spark.read.parquet(existing_paths)
```

and that’s it, this does the job!
