<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<body style="font-family:Arial;font-size:12pt;background-color:#EEEEEE">

<h2>Questions</h2>
<table border="1"><thead><tr bgcolor="#9acd32">
<th style="text-align:left">ID</th>
<th style="text-align:left">Title</th>
<th style="text-align:left">Prompt</th>
</tr></thead><tbody>
<xsl:for-each select="study/questions/question">
<tr>
<td><xsl:attribute select="id"/></td>
<td><xsl:attribute select="title"/></td>
<td><xsl:value-of select="prompt"/></td>
</tr>
</xsl:for-each>
</tbody></table>

</body>
</html>
