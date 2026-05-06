=LET(
  urlList, Summary!AK4:AK7,
  subjectList, FILTER(Setup!A4:A, Setup!A4:A <> ""),

  REDUCE(
    "",
    urlList,
    LAMBDA(fileAcc, url,
      LET(
        fileResult,
        REDUCE(
          "",
          subjectList,
          LAMBDA(sheetAcc, sheetName,
            LET(
  sheet, "'" & sheetName & "'!",
  rng, IFERROR(IMPORTRANGE(url, sheet & "AU8:AU33"), ""),
  labels, IF(rng<>"", sheetName, ""),
  result, HSTACK(labels, rng),

  IF(sheetAcc = "", result, VSTACK(sheetAcc, result))
)
          )
        ),

        IF(fileAcc = "", fileResult, VSTACK(fileAcc, fileResult))
      )
    )
  )
)