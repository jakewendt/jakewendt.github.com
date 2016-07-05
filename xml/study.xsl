<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<body style="font-family:Calibri;font-size:12pt;background-color:#EEEEEE">

<p><xsl:value-of select="/study/introduction"/></p>

<h2>Questions</h2>
<table border="1"><thead><tr bgcolor="#AAAAFF">
	<th style="text-align:left">ID</th>
	<th style="text-align:left">Title</th>
	<th style="text-align:left" colspan="2">Prompt</th>
</tr></thead><tbody>
<xsl:for-each select="/study/questions/question">
	<xsl:sort select="@ordering" data-type="number"/>
	<tr>
		<td><xsl:value-of select="@id"/></td>
		<td><xsl:value-of select="@title"/></td>
		<td>
			<xsl:attribute name="colspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="prompt"/></td>
	</tr>
	<xsl:for-each select="./option">
		<xsl:sort select="@ordering" data-type="number"/>
		<tr>
			<td></td>
			<td></td>
			<td><xsl:value-of select="@value"/></td>
			<td><xsl:value-of select="@name"/></td>
		</tr>
	</xsl:for-each><!-- xsl:for-each select="./option" -->
</xsl:for-each><!-- xsl:for-each select="/study/questions/question" -->
</tbody></table>

</body>
</html>
