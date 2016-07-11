<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<head><style>
body {
	font-family: Calibri;
	font-size: 12pt;
	background-color: #EEEEEE
}
table {
	border-collapse: collapse;
}
table, td, th {
	border: 1px solid black;
}
table thead tr {
	background-color: #BBF;
}
tr {
	vertical-align: top;
}
th {
	text-align: left;
}
td, th {
	padding: 5px;
}
tr.question {
	border-top: 3px double black;
}
</style></head>
<body>

<p><xsl:value-of select="/study/introduction"/></p>

<h2>Questions</h2>
<table><thead><tr>
	<th>ID</th>
	<th>Ordering</th>
<!--
	<th>networkRelationshipExprId</th>
	<th>networkParams</th>
	<th>askingStyleList</th>
-->
	<th>subjectType</th>
	<th>Title</th>
	<th colspan="2">Prompt</th>
	<th>Dependency</th>
</tr></thead><tbody>
<xsl:for-each select="/study/questions/question">
	<xsl:sort select="@ordering" data-type="number"/>
	<tr class='question'>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@id"/></td>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@ordering"/></td>

<!--
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@networkRelationshipExprId"/></td>
16443	on first. All else blank.
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@networkParams"/></td>
{"nodeColor":{"questionId":"43545","options":[{"id":"234496","color":"#07f"},{"id":"234497","color":"#000"}]},"nodeShape":{"questionId":"43546","options":[{"id":"234630","shape":"circle"},{"id":"234631","shape":"square"}]},"nodeSize":{"questionId":"degree","options":[]}}	on first. All else blank.
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@askingStyleList"/></td>
-->
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@subjectType"/></td>


		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
			<xsl:value-of select="@title"/></td>
		<td>
			<xsl:attribute name="colspan">2</xsl:attribute>
			<xsl:value-of select="prompt"/></td>
		<td>
			<xsl:attribute name="rowspan"><xsl:value-of select="count(option) + 1"/></xsl:attribute>
<xsl:if test="@answerReasonExpressionId != ''">
Expression:<xsl:value-of select="@answerReasonExpressionId"/>, 
<xsl:variable name="expid" select="@answerReasonExpressionId" />
Question:<xsl:value-of select="/study/expressions/expression[@id=$expid]/@questionId"/>
</xsl:if></td>
	</tr>
	<xsl:for-each select="./option">
		<xsl:sort select="@ordering" data-type="number"/>
		<tr>
			<td><xsl:value-of select="@value"/></td>
			<td><xsl:value-of select="@name"/></td>
		</tr>
	</xsl:for-each><!-- xsl:for-each select="./option" -->
</xsl:for-each><!-- xsl:for-each select="/study/questions/question" -->
</tbody></table>

</body>
</html>
