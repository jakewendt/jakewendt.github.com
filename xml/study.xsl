<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<body style="font-family:Arial;font-size:12pt;background-color:#EEEEEE">

<p><xsl:value-of select="/study/introduction"/></p>

<h2>Questions</h2>
<table border="1"><thead><tr bgcolor="#9acd32">
	<th style="text-align:left">ID</th>
	<th style="text-align:left">Title</th>
	<th style="text-align:left">Prompt</th>
</tr></thead><tbody>
<xsl:for-each select="/study/questions/question">
	<tr>
		<td><xsl:value-of select="@id"/></td>
		<td><xsl:value-of select="@title"/></td>
		<td><xsl:value-of select="prompt"/></td>
	</tr>
	<xsl:for-each select="./option">
		<xsl:sort select="@ordering" data-type="number"/>
		<tr>
			<td></td>
			<td></td>
			<td><xsl:value-of select="@ordering"/> - <xsl:value-of select="@value"/> - <xsl:value-of select="@name"/></td>
		</tr>
	</xsl:for-each><!-- xsl:for-each select="./option" -->
</xsl:for-each><!-- xsl:for-each select="/study/questions/question" -->
</tbody></table>

</body>
</html>
